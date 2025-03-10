import prisma from "@/lib/prisma";
import { CreateCardInput, UpdateCardInput } from "@/types/card";

export async function getCards() {
  return await prisma.card.findMany();
}

export async function createCard(data: CreateCardInput) {
  return await prisma.card.create({ data });
}

export async function updateCard(data: UpdateCardInput) {
  return await prisma.card.update({
    where: { id: data.id },
    data,
  });
}

export async function deleteCard(id: string) {
  return await prisma.card.delete({
    where: { id },
  });
}
