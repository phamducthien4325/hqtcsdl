import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { buildPagination, toPaginatedResponse } from "../utils/pagination.js";

export async function listProducts(query) {
  const { page, pageSize, skip, take } = buildPagination(query);
  const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;

  const where = {
    ...(query.productLine ? { productLine: query.productLine } : {}),
    ...(query.search
      ? {
          OR: [
            { productName: { contains: query.search } },
            { productVendor: { contains: query.search } },
            { productDescription: { contains: query.search } }
          ]
        }
      : {}),
    ...(minPrice || maxPrice
      ? {
          buyPrice: {
            ...(minPrice ? { gte: minPrice } : {}),
            ...(maxPrice ? { lte: maxPrice } : {})
          }
        }
      : {})
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { productName: "asc" },
      include: {
        line: true
      }
    }),
    prisma.product.count({ where })
  ]);

  return toPaginatedResponse(items, total, { page, pageSize });
}

export async function getProduct(productCode) {
  const product = await prisma.product.findUnique({
    where: { productCode },
    include: {
      line: true,
      orderDetails: {
        take: 10,
        include: {
          order: {
            select: {
              orderNumber: true,
              orderDate: true,
              status: true
            }
          }
        }
      }
    }
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
}

export async function createProduct(data) {
  return prisma.product.create({ data });
}

export async function updateProduct(productCode, data) {
  await getProduct(productCode);
  return prisma.product.update({ where: { productCode }, data });
}

export async function deleteProduct(productCode) {
  await getProduct(productCode);
  await prisma.product.delete({ where: { productCode } });
  return { success: true };
}
