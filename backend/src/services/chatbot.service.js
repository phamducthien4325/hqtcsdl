import { Prisma } from "@prisma/client";
import OpenAI from "openai";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

const openai = env.openAiApiKey ? new OpenAI({ apiKey: env.openAiApiKey }) : null;

const fallbackRules = [
  {
    test: /top\s+(\d+)\s+customers/i,
    build(question) {
      const match = question.match(/top\s+(\d+)\s+customers/i);
      const limit = Number(match?.[1] ?? 5);
      return {
        sql: Prisma.sql`
          SELECT c.customerName, SUM(p.amount) AS revenue
          FROM customers c
          JOIN payments p ON p.customerNumber = c.customerNumber
          GROUP BY c.customerName
          ORDER BY revenue DESC
          LIMIT ${limit}
        `,
        explanation: `Top ${limit} customers by payment revenue`
      };
    }
  },
  {
    test: /total\s+revenue\s+in\s+(\d{4})/i,
    build(question) {
      const year = Number(question.match(/(\d{4})/)?.[1]);
      return {
        sql: Prisma.sql`
          SELECT YEAR(paymentDate) AS year, SUM(amount) AS revenue
          FROM payments
          WHERE YEAR(paymentDate) = ${year}
          GROUP BY YEAR(paymentDate)
        `,
        explanation: `Total revenue in ${year}`
      };
    }
  },
  {
    test: /orders\s+from\s+([a-zA-Z\s]+)/i,
    build(question) {
      const country = question.match(/orders\s+from\s+([a-zA-Z\s]+)/i)?.[1]?.trim() ?? "";
      return {
        sql: Prisma.sql`
          SELECT o.orderNumber, o.orderDate, o.status, c.customerName, c.country
          FROM orders o
          JOIN customers c ON c.customerNumber = o.customerNumber
          WHERE c.country = ${country}
          ORDER BY o.orderDate DESC
          LIMIT 25
        `,
        explanation: `Recent orders from customers in ${country}`
      };
    }
  }
];

async function askOpenAi(question) {
  if (!openai) {
    return { data: null, error: null };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: env.openAiModel,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Convert the user request into a single safe SELECT query against the classicmodels schema. Return strict JSON with keys sql and explanation. Use only tables customers, orders, orderdetails, products, productlines, payments, employees, offices. Never include INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, comments, backticks, or multiple statements."
        },
        {
          role: "user",
          content: question
        }
      ]
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) {
      return { data: null, error: "empty_response" };
    }

    return { data: JSON.parse(text), error: null };
  } catch (error) {
    return {
      data: null,
      error: error.status === 429 ? "insufficient_quota" : error.message
    };
  }
}

function pickFallback(question) {
  const rule = fallbackRules.find((item) => item.test.test(question));
  return rule ? rule.build(question) : null;
}

function assertSafeSelect(sqlText) {
  const normalized = sqlText.trim().toLowerCase();
  const forbidden = ["insert", "update", "delete", "drop", "alter", "truncate", ";"];
  if (!normalized.startsWith("select") || forbidden.some((token) => normalized.includes(token))) {
    throw new ApiError(400, "Chatbot generated an unsafe query");
  }
}

export async function runChatbotQuery(question) {
  const generated = await askOpenAi(question);

  if (generated.data?.sql) {
    assertSafeSelect(generated.data.sql);
    const rows = await prisma.$queryRawUnsafe(generated.data.sql);
    return {
      explanation: generated.data.explanation ?? "Generated with OpenAI",
      sql: generated.data.sql,
      rows
    };
  }

  const fallback = pickFallback(question);
  if (!fallback) {
    if (generated.error === "insufficient_quota") {
      throw new ApiError(503, "OpenAI quota exceeded. Top up billing or use a built-in supported query.");
    }
    if (env.openAiApiKey) {
      throw new ApiError(
        503,
        generated.error
          ? `OpenAI query generation failed: ${generated.error}`
          : "OpenAI query generation is unavailable right now."
      );
    }
    throw new ApiError(400, "Unable to answer that question with the fallback chatbot");
  }

  const rows = await prisma.$queryRaw(fallback.sql);
  return {
    explanation: fallback.explanation,
    sql: fallback.sql.sql,
    rows
  };
}
