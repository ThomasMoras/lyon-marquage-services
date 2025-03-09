import { PrismaClient } from "@prisma/client";
import { Carousel, SectionType } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCarousels(type?: string) {
  return await prisma.carousel.findMany({
    where: type
      ? {
          type: type.toUpperCase() as SectionType,
        }
      : undefined,
    orderBy: {
      order: "asc",
    },
  });
}

export async function updateCarousel(id: string, data: Partial<Carousel>) {
  return await prisma.carousel.update({
    where: { id },
    data,
  });
}

export async function createCarousel(data: Carousel) {
  try {
    const result = await prisma.carousel.create({ data });
    return result;
  } catch (error) {
    console.error("SERVICE - Error creating carousel:", error);
    throw error;
  }
}

export async function deleteCarousel(id: string) {
  return await prisma.carousel.delete({
    where: { id },
  });
}
