import { Prisma } from "@prisma/client";
import OpenAI from "openai";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

const llmCandidates = [
  env.geminiApiKey
    ? {
        provider: "gemini",
        label: "Gemini primary",
        model: env.geminiModel,
        client: new OpenAI({
          apiKey: env.geminiApiKey,
          baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
        })
      }
    : null,
  env.geminiApiKeyFallback1
    ? {
        provider: "gemini",
        label: "Gemini fallback 1",
        model: env.geminiModel,
        client: new OpenAI({
          apiKey: env.geminiApiKeyFallback1,
          baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
        })
      }
    : null,
  env.geminiApiKeyFallback2
    ? {
        provider: "gemini",
        label: "Gemini fallback 2",
        model: env.geminiModel,
        client: new OpenAI({
          apiKey: env.geminiApiKeyFallback2,
          baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
        })
      }
    : null,
  env.openAiApiKey
    ? {
        provider: "openai",
        label: "OpenAI fallback",
        model: env.openAiModel,
        client: new OpenAI({ apiKey: env.openAiApiKey })
      }
    : null
].filter(Boolean);

const allowedTables = new Set([
  "customers",
  "orders",
  "orderdetails",
  "products",
  "productlines",
  "payments",
  "employees",
  "offices"
]);

const countryAliases = new Map([
  ["france", "France"],
  ["phap", "France"],
  ["duc", "Germany"],
  ["germany", "Germany"],
  ["usa", "USA"],
  ["us", "USA"],
  ["my", "USA"],
  ["united states", "USA"],
  ["uk", "UK"],
  ["anh", "UK"],
  ["united kingdom", "UK"],
  ["japan", "Japan"],
  ["nhat", "Japan"],
  ["canada", "Canada"],
  ["mexico", "Mexico"],
  ["singapore", "Singapore"],
  ["spain", "Spain"],
  ["tay ban nha", "Spain"],
  ["italy", "Italy"],
  ["y", "Italy"],
  ["norway", "Norway"],
  ["sweden", "Sweden"],
  ["danish", "Denmark"],
  ["denmark", "Denmark"],
  ["australia", "Australia"],
  ["new zealand", "New Zealand"],
  ["hong kong", "Hong Kong"],
  ["philippines", "Philippines"]
]);

function stripDiacritics(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function normalizeQuestion(question) {
  return stripDiacritics(question)
    .toLowerCase()
    .replace(/[?.,!]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractLimit(question, defaultValue = 5, max = 20) {
  const match = question.match(/\b(\d{1,2})\b/);
  const value = Number(match?.[1] ?? defaultValue);
  return Math.min(Math.max(value, 1), max);
}

function detectYear(normalizedQuestion) {
  const explicitYear = normalizedQuestion.match(/\b(19|20)\d{2}\b/);
  if (explicitYear) {
    return Number(explicitYear[0]);
  }

  const currentYear = new Date().getFullYear();
  if (
    normalizedQuestion.includes("nam nay") ||
    normalizedQuestion.includes("this year") ||
    normalizedQuestion.includes("current year")
  ) {
    return currentYear;
  }
  if (
    normalizedQuestion.includes("nam ngoai") ||
    normalizedQuestion.includes("last year") ||
    normalizedQuestion.includes("previous year")
  ) {
    return currentYear - 1;
  }

  return null;
}

function detectCountry(normalizedQuestion) {
  const countries = [...countryAliases.entries()].sort((left, right) => right[0].length - left[0].length);
  const found = countries.find(([alias]) => normalizedQuestion.includes(alias));
  return found?.[1] ?? null;
}

function formatValue(value) {
  if (typeof value === "bigint") {
    const maxSafeBigInt = BigInt(Number.MAX_SAFE_INTEGER);
    const minSafeBigInt = BigInt(Number.MIN_SAFE_INTEGER);
    return value <= maxSafeBigInt && value >= minSafeBigInt ? Number(value) : value.toString();
  }
  if (value instanceof Prisma.Decimal) {
    return Number(value);
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return value;
}

function serializeRows(rows) {
  return rows.map((row) =>
    Object.fromEntries(Object.entries(row).map(([key, value]) => [key, formatValue(value)]))
  );
}

function buildGenericAnswer(explanation, rows) {
  if (!rows.length) {
    return `Khong tim thay du lieu phu hop cho yeu cau: ${explanation}.`;
  }

  if (rows.length === 1) {
    const row = rows[0];
    const fragments = Object.entries(row)
      .slice(0, 4)
      .map(([key, value]) => `${key}: ${formatValue(value)}`);
    return `${explanation}. Ket qua: ${fragments.join(", ")}.`;
  }

  return `${explanation}. Tim thay ${rows.length} dong du lieu.`;
}

function buildQuestionContext(question) {
  const normalized = normalizeQuestion(question);
  return {
    question,
    normalized,
    year: detectYear(normalized),
    country: detectCountry(normalized)
  };
}

const fallbackRules = [
  {
    matches({ normalized }) {
      return (
        /(top|best|highest)/.test(normalized) &&
        /(customer|khach hang)/.test(normalized)
      ) || /(\d+)\s+(khach hang|customers?)/.test(normalized);
    },
    build(context) {
      const limit = extractLimit(context.normalized, 5, 15);
      const hasYearFilter = Number.isInteger(context.year);
      return {
        query: Prisma.sql`
          SELECT c.customerName, c.country, ROUND(SUM(p.amount), 2) AS revenue
          FROM customers c
          JOIN payments p ON p.customerNumber = c.customerNumber
          ${hasYearFilter ? Prisma.sql`WHERE YEAR(p.paymentDate) = ${context.year}` : Prisma.empty}
          GROUP BY c.customerNumber, c.customerName, c.country
          ORDER BY revenue DESC
          LIMIT ${limit}
        `,
        sqlText: hasYearFilter
          ? `SELECT c.customerName, c.country, ROUND(SUM(p.amount), 2) AS revenue
FROM customers c
JOIN payments p ON p.customerNumber = c.customerNumber
WHERE YEAR(p.paymentDate) = ${context.year}
GROUP BY c.customerNumber, c.customerName, c.country
ORDER BY revenue DESC
LIMIT ${limit}`
          : `SELECT c.customerName, c.country, ROUND(SUM(p.amount), 2) AS revenue
FROM customers c
JOIN payments p ON p.customerNumber = c.customerNumber
GROUP BY c.customerNumber, c.customerName, c.country
ORDER BY revenue DESC
LIMIT ${limit}`,
        explanation: hasYearFilter
          ? `Top ${limit} customers by payment revenue in ${context.year}`
          : `Top ${limit} customers by payment revenue`
      };
    }
  },
  {
    matches({ normalized, year }) {
      return (
        /(tong doanh thu|doanh thu tong|total revenue|revenue)/.test(normalized) &&
        (Number.isInteger(year) || /(nam nay|nam ngoai|this year|last year)/.test(normalized))
      );
    },
    build(context) {
      if (!Number.isInteger(context.year)) {
        return null;
      }

      return {
        query: Prisma.sql`
          SELECT YEAR(paymentDate) AS year, ROUND(SUM(amount), 2) AS revenue
          FROM payments
          WHERE YEAR(paymentDate) = ${context.year}
          GROUP BY YEAR(paymentDate)
        `,
        sqlText: `SELECT YEAR(paymentDate) AS year, ROUND(SUM(amount), 2) AS revenue
FROM payments
WHERE YEAR(paymentDate) = ${context.year}
GROUP BY YEAR(paymentDate)`,
        explanation: `Total revenue in ${context.year}`
      };
    }
  },
  {
    matches({ normalized, country }) {
      return country && /(orders|don hang)/.test(normalized);
    },
    build(context) {
      return {
        query: Prisma.sql`
          SELECT o.orderNumber, o.orderDate, o.status, c.customerName, c.country
          FROM orders o
          JOIN customers c ON c.customerNumber = o.customerNumber
          WHERE c.country = ${context.country}
          ORDER BY o.orderDate DESC
          LIMIT 25
        `,
        sqlText: `SELECT o.orderNumber, o.orderDate, o.status, c.customerName, c.country
FROM orders o
JOIN customers c ON c.customerNumber = o.customerNumber
WHERE c.country = '${context.country}'
ORDER BY o.orderDate DESC
LIMIT 25`,
        explanation: `Recent orders from customers in ${context.country}`
      };
    }
  },
  {
    matches({ normalized, country }) {
      return (
        country &&
        /(average|trung binh|avg)/.test(normalized) &&
        /(payment|thanh toan)/.test(normalized)
      );
    },
    build(context) {
      return {
        query: Prisma.sql`
          SELECT c.country, ROUND(AVG(p.amount), 2) AS averagePayment
          FROM payments p
          JOIN customers c ON c.customerNumber = p.customerNumber
          WHERE c.country = ${context.country}
          GROUP BY c.country
        `,
        sqlText: `SELECT c.country, ROUND(AVG(p.amount), 2) AS averagePayment
FROM payments p
JOIN customers c ON c.customerNumber = p.customerNumber
WHERE c.country = '${context.country}'
GROUP BY c.country`,
        explanation: `Average payment amount for customers in ${context.country}`
      };
    }
  },
  {
    matches({ normalized }) {
      return (
        /(top|best|most|ban chay|nhieu nhat)/.test(normalized) &&
        /(product|san pham)/.test(normalized)
      );
    },
    build(context) {
      const limit = extractLimit(context.normalized, 10, 20);
      return {
        query: Prisma.sql`
          SELECT p.productName, SUM(od.quantityOrdered) AS totalQuantity
          FROM orderdetails od
          JOIN products p ON p.productCode = od.productCode
          GROUP BY p.productCode, p.productName
          ORDER BY totalQuantity DESC
          LIMIT ${limit}
        `,
        sqlText: `SELECT p.productName, SUM(od.quantityOrdered) AS totalQuantity
FROM orderdetails od
JOIN products p ON p.productCode = od.productCode
GROUP BY p.productCode, p.productName
ORDER BY totalQuantity DESC
LIMIT ${limit}`,
        explanation: `Top ${limit} products by ordered quantity`
      };
    }
  },
  {
    matches({ normalized }) {
      return /(product line|dong san pham|nhom san pham)/.test(normalized) && /(revenue|doanh thu)/.test(normalized);
    },
    build() {
      return {
        query: Prisma.sql`
          SELECT pl.productLine, ROUND(SUM(od.quantityOrdered * od.priceEach), 2) AS revenue
          FROM orderdetails od
          JOIN products p ON p.productCode = od.productCode
          JOIN productlines pl ON pl.productLine = p.productLine
          GROUP BY pl.productLine
          ORDER BY revenue DESC
        `,
        sqlText: `SELECT pl.productLine, ROUND(SUM(od.quantityOrdered * od.priceEach), 2) AS revenue
FROM orderdetails od
JOIN products p ON p.productCode = od.productCode
JOIN productlines pl ON pl.productLine = p.productLine
GROUP BY pl.productLine
ORDER BY revenue DESC`,
        explanation: "Revenue by product line"
      };
    }
  }
];

async function askOpenAi(question) {
  if (!llmCandidates.length) {
    return { data: null, error: null };
  }

  let lastError = null;

  for (const candidate of llmCandidates) {
    try {
      const completion = await candidate.client.chat.completions.create({
        model: candidate.model,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant for a ClassicModels dashboard.

Users may ask in Vietnamese or English.

You support two modes:
- "answer": for general knowledge, explanation, guidance, writing help, or any question that does not require querying the database
- "sql": for questions that require actual data from the ClassicModels database

Schema summary:
- customers(customerNumber, customerName, country, city, salesRepEmployeeNumber, creditLimit)
- orders(orderNumber, orderDate, requiredDate, shippedDate, status, customerNumber)
- orderdetails(orderNumber, productCode, quantityOrdered, priceEach, orderLineNumber)
- products(productCode, productName, productLine, productVendor, quantityInStock, buyPrice, MSRP)
- productlines(productLine, textDescription)
- payments(customerNumber, checkNumber, paymentDate, amount)
- employees(employeeNumber, firstName, lastName, officeCode, reportsTo, jobTitle)
- offices(officeCode, city, country, territory)

Relationships:
- customers.customerNumber = orders.customerNumber
- customers.customerNumber = payments.customerNumber
- orders.orderNumber = orderdetails.orderNumber
- products.productCode = orderdetails.productCode
- products.productLine = productlines.productLine
- customers.salesRepEmployeeNumber = employees.employeeNumber
- employees.officeCode = offices.officeCode

Rules:
- Return strict JSON only
- Always include: mode, answer, explanation
- Include sql only when mode is "sql"
- mode must be either "answer" or "sql"
- If the user asks a general question, use mode "answer" and do not generate SQL
- If the user asks for data from the ClassicModels database, use mode "sql"
- sql must be exactly one SELECT statement when mode is "sql"
- Never use INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, comments, backticks, or semicolons
- Use only the listed tables
- Add LIMIT when returning detailed rows unless the query is a single aggregate row
- answer should read naturally like ChatGPT and can be in the same language as the user
- explanation should briefly describe what you did`
          },
          {
            role: "user",
            content: question
          }
        ]
      });

      const text = completion.choices[0]?.message?.content;
      if (!text) {
        lastError = { provider: candidate.provider, label: candidate.label, error: "empty_response" };
        continue;
      }

      return { data: JSON.parse(text), error: null, provider: candidate.provider, label: candidate.label };
    } catch (error) {
      lastError = {
        provider: candidate.provider,
        label: candidate.label,
        error: error.status === 429 ? "insufficient_quota" : error.message,
        status: error.status ?? null
      };
    }
  }

  return { data: null, ...lastError };
}

function pickFallback(question) {
  const context = buildQuestionContext(question);
  const rule = fallbackRules.find((item) => item.matches(context));
  const built = rule?.build(context) ?? null;
  return built ? { ...built, context } : null;
}

function assertSafeSelect(sqlText) {
  const normalized = sqlText.trim().toLowerCase();
  const forbidden = [/\binsert\b/, /\bupdate\b/, /\bdelete\b/, /\bdrop\b/, /\balter\b/, /\btruncate\b/, /;/, /--/, /\/\*/];

  if (!normalized.startsWith("select") || forbidden.some((pattern) => pattern.test(normalized))) {
    throw new ApiError(400, "Chatbot generated an unsafe query");
  }

  const tableMatches = [...normalized.matchAll(/\b(?:from|join)\s+([a-z_]+)/g)];
  const tables = tableMatches.map((match) => match[1]);
  if (!tables.length || tables.some((table) => !allowedTables.has(table))) {
    throw new ApiError(400, "Chatbot tried to query unsupported tables");
  }
}

async function executeUnsafeSelect(sqlText) {
  assertSafeSelect(sqlText);
  const rows = await prisma.$queryRawUnsafe(sqlText);
  return serializeRows(rows);
}

async function executeFallbackQuery(fallback) {
  const rows = await prisma.$queryRaw(fallback.query);
  return serializeRows(rows);
}

export async function runChatbotQuery(question) {
  const trimmedQuestion = question.trim();
  const generated = await askOpenAi(trimmedQuestion);
  const usedProvider = generated.provider ?? llmCandidates[0]?.provider ?? null;
  const fallback = pickFallback(trimmedQuestion);

  if (generated.data?.mode === "answer" && generated.data?.answer) {
    return {
      explanation:
        generated.data.explanation ??
        `Answered directly with ${usedProvider === "gemini" ? "Gemini" : "OpenAI"}`,
      answer: generated.data.answer.trim(),
      sql: null,
      rows: []
    };
  }

  if (generated.data?.sql) {
    try {
      const rows = await executeUnsafeSelect(generated.data.sql);
      return {
        explanation:
          generated.data.explanation ??
          `Generated with ${usedProvider === "gemini" ? "Gemini" : "OpenAI"}`,
        answer:
          generated.data.answer?.trim() ||
          buildGenericAnswer(generated.data.explanation ?? "LLM query result", rows),
        sql: generated.data.sql,
        rows
      };
    } catch (error) {
      if (!fallback) {
        throw error;
      }
    }
  }

  if (!fallback) {
    if (generated.error === "insufficient_quota") {
      throw new ApiError(
        503,
        usedProvider === "gemini"
          ? "All Gemini keys exceeded quota. Top up billing or use a built-in supported query."
          : "OpenAI quota exceeded. Top up billing or use a built-in supported query."
      );
    }
    if (llmCandidates.length) {
      throw new ApiError(
        503,
        generated.error
          ? `${generated.label ?? (usedProvider === "gemini" ? "Gemini" : "OpenAI")} query generation failed: ${generated.error}`
          : `${usedProvider === "gemini" ? "Gemini" : "OpenAI"} query generation is unavailable right now.`
      );
    }
    throw new ApiError(
      400,
      "Chatbot chua hieu cau hoi nay. Hay thu hoi ro hon, vi du: top 5 khach hang, doanh thu nam 2004, don hang tu France."
    );
  }

  const rows = await executeFallbackQuery(fallback);
  return {
    explanation: fallback.explanation,
    answer: buildGenericAnswer(fallback.explanation, rows),
    sql: fallback.sqlText,
    rows
  };
}
