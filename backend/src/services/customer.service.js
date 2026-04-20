import { prisma } from "../config/prisma.js";
import { buildPagination, toPaginatedResponse } from "../utils/pagination.js";
import { ApiError } from "../utils/api-error.js";

export async function listCustomers(query) {
  const { page, pageSize, skip, take } = buildPagination(query);
  const where = {
    ...(query.country ? { country: query.country } : {}),
    ...(query.search
      ? {
          OR: [
            { customerName: { contains: query.search } },
            { contactFirstName: { contains: query.search } },
            { contactLastName: { contains: query.search } }
          ]
        }
      : {})
  };

  const [items, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take,
      orderBy: { customerName: "asc" },
      include: {
        salesRep: {
          select: {
            employeeNumber: true,
            firstName: true,
            lastName: true
          }
        }
      }
    }),
    prisma.customer.count({ where })
  ]);

  return toPaginatedResponse(items, total, { page, pageSize });
}

export async function getCustomer(customerNumber) {
  const customer = await prisma.customer.findUnique({
    where: { customerNumber: Number(customerNumber) },
    include: {
      orders: {
        select: {
          orderNumber: true,
          orderDate: true,
          status: true
        }
      },
      payments: true
    }
  });

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return customer;
}

export async function createCustomer(data) {
  return prisma.customer.create({ data });
}

export async function updateCustomer(customerNumber, data) {
  await getCustomer(customerNumber);
  return prisma.customer.update({
    where: { customerNumber: Number(customerNumber) },
    data
  });
}

export async function deleteCustomer(customerNumber) {
  await getCustomer(customerNumber);
  await prisma.customer.delete({ where: { customerNumber: Number(customerNumber) } });
  return { success: true };
}
