import { prisma } from "../config/prisma.js";
import { buildPagination, toPaginatedResponse } from "../utils/pagination.js";

export async function listPayments(query) {
  const { page, pageSize, skip, take } = buildPagination(query);
  const where = {
    ...(query.customerNumber ? { customerNumber: Number(query.customerNumber) } : {})
  };

  const [items, total, aggregation] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take,
      orderBy: { paymentDate: "desc" },
      include: {
        customer: {
          select: {
            customerName: true,
            country: true
          }
        }
      }
    }),
    prisma.payment.count({ where }),
    prisma.payment.aggregate({
      where,
      _sum: { amount: true },
      _avg: { amount: true }
    })
  ]);

  return {
    ...toPaginatedResponse(items, total, { page, pageSize }),
    summary: {
      totalAmount: aggregation._sum.amount ?? 0,
      averageAmount: aggregation._avg.amount ?? 0
    }
  };
}
