import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function clearData() {
  await prisma.card.deleteMany();
  await prisma.section.deleteMany();
  await prisma.carousel.deleteMany();

  console.log("All data cleared successfully");
}

clearData()
  .catch((e) => {
    console.error("Error clearing data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
