import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function upsertUser(name, email, password, role) {
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.appUser.upsert({
    where: { email },
    update: { name, passwordHash, role },
    create: { name, email, passwordHash, role }
  });
}

async function main() {
  await upsertUser(
    "ClassicModels Admin",
    process.env.DEMO_ADMIN_EMAIL ?? "admin@classicmodels.local",
    process.env.DEMO_ADMIN_PASSWORD ?? "Admin123!",
    Role.admin
  );

  await upsertUser(
    "ClassicModels Staff",
    process.env.DEMO_STAFF_EMAIL ?? "staff@classicmodels.local",
    process.env.DEMO_STAFF_PASSWORD ?? "Staff123!",
    Role.staff
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
