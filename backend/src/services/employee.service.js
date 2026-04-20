import { prisma } from "../config/prisma.js";

export async function listEmployees() {
  return prisma.employee.findMany({
    orderBy: [{ officeCode: "asc" }, { lastName: "asc" }],
    include: {
      office: true,
      manager: {
        select: {
          employeeNumber: true,
          firstName: true,
          lastName: true
        }
      },
      subordinates: {
        select: {
          employeeNumber: true,
          firstName: true,
          lastName: true,
          jobTitle: true
        }
      }
    }
  });
}
