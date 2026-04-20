import { prisma } from "../config/prisma.js";
import { makeCsv } from "../utils/csv.js";
import { makeWorkbookBuffer } from "../utils/excel.js";

async function buildSalesReport() {
  const rows = await prisma.$queryRaw`
    SELECT DATE_FORMAT(paymentDate, '%Y-%m') AS month, SUM(amount) AS revenue, COUNT(*) AS payments
    FROM payments
    GROUP BY DATE_FORMAT(paymentDate, '%Y-%m')
    ORDER BY month
  `;

  return rows.map((row) => ({
    month: row.month,
    revenue: Number(row.revenue ?? 0),
    payments: Number(row.payments ?? 0)
  }));
}

async function buildCustomerReport() {
  const rows = await prisma.$queryRaw`
    SELECT
      c.customerNumber,
      c.customerName,
      c.country,
      COALESCE(o.totalOrders, 0) AS orders,
      COALESCE(p.revenue, 0) AS revenue
    FROM customers c
    LEFT JOIN (
      SELECT customerNumber, COUNT(*) AS totalOrders
      FROM orders
      GROUP BY customerNumber
    ) o ON o.customerNumber = c.customerNumber
    LEFT JOIN (
      SELECT customerNumber, SUM(amount) AS revenue
      FROM payments
      GROUP BY customerNumber
    ) p ON p.customerNumber = c.customerNumber
    ORDER BY revenue DESC
  `;

  return rows.map((row) => ({
    customerNumber: Number(row.customerNumber),
    customerName: row.customerName,
    country: row.country,
    orders: Number(row.orders ?? 0),
    revenue: Number(row.revenue ?? 0)
  }));
}

async function buildInventoryReport() {
  const rows = await prisma.product.findMany({
    orderBy: { quantityInStock: "asc" },
    include: {
      line: true
    }
  });

  return rows.map((row) => ({
    productCode: row.productCode,
    productName: row.productName,
    productLine: row.productLine,
    quantityInStock: row.quantityInStock,
    buyPrice: Number(row.buyPrice),
    msrp: Number(row.MSRP)
  }));
}

const reportBuilders = {
  sales: buildSalesReport,
  customers: buildCustomerReport,
  inventory: buildInventoryReport
};

export async function getReportPayload(type) {
  const reportBuilder = reportBuilders[type];
  if (!reportBuilder) {
    return null;
  }

  return reportBuilder();
}

export async function exportReport(type, format) {
  const rows = await getReportPayload(type);
  if (!rows) {
    return null;
  }

  if (format === "xlsx") {
    return {
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      extension: "xlsx",
      buffer: await makeWorkbookBuffer(type, rows)
    };
  }

  return {
    contentType: "text/csv",
    extension: "csv",
    buffer: Buffer.from(makeCsv(rows))
  };
}
