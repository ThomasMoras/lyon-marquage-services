import { PrismaClient } from "@prisma/client";
import { CreateCardInput, UpdateCardInput } from "@/types/cardTypes";

const prisma = new PrismaClient();

export async function getCards() {
  return prisma.card.findMany({
    orderBy: {
      order: "asc",
    },
  });
}

export async function createCard(data: CreateCardInput) {
  return prisma.card.create({
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      type: data.type,
      order: data.order || 0,
    },
  });
}

export async function updateCard(data: UpdateCardInput) {
  const { id, ...updateData } = data;
  return prisma.card.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteCard(id: string) {
  return prisma.card.delete({
    where: { id },
  });
}
