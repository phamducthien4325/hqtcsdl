import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { analyticsCache } from "../utils/cache.js";

function numeric(value) {
  return Number(value ?? 0);
}

export async function getDashboardAnalytics() {
  const cached = analyticsCache.get("dashboard");
  if (cached) {
    return cached;
  }

  const [
    totalRevenue,
    revenueOverTime,
    ordersPerMonth,
    topCustomers,
    topProducts,
    revenueByCountry,
    revenueByProductLine
  ] = await Promise.all([
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.$queryRaw`
      SELECT DATE_FORMAT(paymentDate, '%Y-%m') AS month, SUM(amount) AS revenue
      FROM payments
      GROUP BY DATE_FORMAT(paymentDate, '%Y-%m')
      ORDER BY month
    `,
    prisma.$queryRaw`
      SELECT DATE_FORMAT(orderDate, '%Y-%m') AS month, COUNT(*) AS totalOrders
      FROM orders
      GROUP BY DATE_FORMAT(orderDate, '%Y-%m')
      ORDER BY month
    `,
    prisma.$queryRaw`
      SELECT c.customerNumber, c.customerName, SUM(p.amount) AS revenue
      FROM customers c
      JOIN payments p ON p.customerNumber = c.customerNumber
      GROUP BY c.customerNumber, c.customerName
      ORDER BY revenue DESC
      LIMIT 10
    `,
    prisma.$queryRaw`
      SELECT p.productCode, p.productName, SUM(od.quantityOrdered) AS totalQuantity
      FROM products p
      JOIN orderdetails od ON od.productCode = p.productCode
      GROUP BY p.productCode, p.productName
      ORDER BY totalQuantity DESC
      LIMIT 10
    `,
    prisma.$queryRaw`
      SELECT c.country, SUM(pay.amount) AS revenue
      FROM customers c
      JOIN payments pay ON pay.customerNumber = c.customerNumber
      GROUP BY c.country
      ORDER BY revenue DESC
    `,
    prisma.$queryRaw`
      SELECT pl.productLine, SUM(od.quantityOrdered * od.priceEach) AS revenue
      FROM productlines pl
      JOIN products p ON p.productLine = pl.productLine
      JOIN orderdetails od ON od.productCode = p.productCode
      GROUP BY pl.productLine
      ORDER BY revenue DESC
    `
  ]);

  const payload = {
    totalRevenue: numeric(totalRevenue._sum.amount),
    revenueOverTime: revenueOverTime.map((row) => ({
      month: row.month,
      revenue: numeric(row.revenue)
    })),
    ordersPerMonth: ordersPerMonth.map((row) => ({
      month: row.month,
      totalOrders: numeric(row.totalOrders)
    })),
    topCustomers: topCustomers.map((row) => ({
      customerNumber: numeric(row.customerNumber),
      customerName: row.customerName,
      revenue: numeric(row.revenue)
    })),
    topProducts: topProducts.map((row) => ({
      productCode: row.productCode,
      productName: row.productName,
      totalQuantity: numeric(row.totalQuantity)
    })),
    revenueByCountry: revenueByCountry.map((row) => ({
      country: row.country,
      revenue: numeric(row.revenue)
    })),
    revenueByProductLine: revenueByProductLine.map((row) => ({
      productLine: row.productLine,
      revenue: numeric(row.revenue)
    }))
  };

  analyticsCache.set("dashboard", payload);
  return payload;
}

export async function getPivotData() {
  const rows = await prisma.$queryRaw(Prisma.sql`
    SELECT
      c.customerName,
      c.country,
      p.productLine,
      DATE_FORMAT(o.orderDate, '%Y-%m-%d') AS orderDate,
      od.orderNumber,
      (od.quantityOrdered * od.priceEach) AS amount
    FROM orderdetails od
    JOIN orders o ON o.orderNumber = od.orderNumber
    JOIN customers c ON c.customerNumber = o.customerNumber
    JOIN products p ON p.productCode = od.productCode
  `);

  return rows.map((row) => ({
    customerName: row.customerName,
    country: row.country,
    productLine: row.productLine,
    date: row.orderDate,
    orderNumber: numeric(row.orderNumber),
    amount: numeric(row.amount)
  }));
}
