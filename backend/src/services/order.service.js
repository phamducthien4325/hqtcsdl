import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { buildPagination, toPaginatedResponse } from "../utils/pagination.js";

function buildOrderWhere(query) {
  return {
    ...(query.status ? { status: query.status } : {}),
    ...(query.customerNumber ? { customerNumber: Number(query.customerNumber) } : {}),
    ...((query.dateFrom || query.dateTo)
      ? {
          orderDate: {
            ...(query.dateFrom ? { gte: new Date(query.dateFrom) } : {}),
            ...(query.dateTo ? { lte: new Date(query.dateTo) } : {})
          }
        }
      : {})
  };
}

export async function listOrders(query) {
  const { page, pageSize, skip, take } = buildPagination(query);
  const where = buildOrderWhere(query);

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take,
      orderBy: { orderDate: "desc" },
      include: {
        customer: {
          select: {
            customerName: true,
            country: true
          }
        },
        orderDetails: {
          include: {
            product: {
              select: {
                productName: true,
                productLine: true
              }
            }
          }
        }
      }
    }),
    prisma.order.count({ where })
  ]);

  return toPaginatedResponse(items, total, { page, pageSize });
}

export async function getOrder(orderNumber) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: Number(orderNumber) },
    include: {
      customer: true,
      orderDetails: {
        include: {
          product: true
        }
      }
    }
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return order;
}

export async function createOrder(data) {
  const { orderDetails, ...orderData } = data;

  return prisma.order.create({
    data: {
      ...orderData,
      orderDate: new Date(orderData.orderDate),
      requiredDate: new Date(orderData.requiredDate),
      shippedDate: orderData.shippedDate ? new Date(orderData.shippedDate) : null,
      orderDetails: {
        create: orderDetails
      }
    },
    include: {
      orderDetails: true
    }
  });
}

export async function updateOrder(orderNumber, data) {
  await getOrder(orderNumber);
  const { orderDetails, ...orderData } = data;

  return prisma.$transaction(async (tx) => {
    if (orderDetails) {
      await tx.orderDetail.deleteMany({
        where: { orderNumber: Number(orderNumber) }
      });
    }

    return tx.order.update({
      where: { orderNumber: Number(orderNumber) },
      data: {
        ...orderData,
        ...(orderData.orderDate ? { orderDate: new Date(orderData.orderDate) } : {}),
        ...(orderData.requiredDate ? { requiredDate: new Date(orderData.requiredDate) } : {}),
        ...(Object.hasOwn(orderData, "shippedDate")
          ? { shippedDate: orderData.shippedDate ? new Date(orderData.shippedDate) : null }
          : {}),
        ...(orderDetails
          ? {
              orderDetails: {
                create: orderDetails
              }
            }
          : {})
      },
      include: { orderDetails: true }
    });
  });
}

export async function deleteOrder(orderNumber) {
  await getOrder(orderNumber);

  await prisma.$transaction([
    prisma.orderDetail.deleteMany({ where: { orderNumber: Number(orderNumber) } }),
    prisma.order.delete({ where: { orderNumber: Number(orderNumber) } })
  ]);

  return { success: true };
}
