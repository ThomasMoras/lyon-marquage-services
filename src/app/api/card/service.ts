import { PrismaClient, SectionType, Prisma } from "@prisma/client";
import { CreateCardInput, UpdateCardInput } from "./schema";

const prisma = new PrismaClient();

// Get cards, optionally filtered by type
export async function getCards(type?: string | null) {
  const whereClause = type ? { type: type as SectionType } : {};

  return prisma.card.findMany({
    where: whereClause,
    orderBy: {
      order: "asc",
    },
    include: {
      file: true,
    },
  });
}

// Create a new card
export async function createCard(data: CreateCardInput) {
  // Prepare data for Prisma
  const createData: Prisma.CardCreateInput = {
    title: data.title || "", // Use empty string as default if title is undefined
    description: data.description || "", // Use empty string as default if description is undefined
    imageUrl: data.imageUrl || "",
    type: data.type,
    order: data.order || 0,
  };

  // Add cropData if it exists - properly handle JSON
  if (data.cropData) {
    createData.cropData = JSON.parse(JSON.stringify(data.cropData)) as Prisma.InputJsonValue;
  }

  // Handle file relation if fileId exists
  if (data.fileId) {
    createData.file = {
      connect: { id: data.fileId },
    };
  }

  return prisma.card.create({
    data: createData,
    include: {
      file: true,
    },
  });
}

// Update an existing card
export async function updateCard(data: UpdateCardInput) {
  const { id, ...updateFields } = data;

  // Prepare update data
  const updateData: Prisma.CardUpdateInput = {};

  // Only include fields that are defined
  if (updateFields.title !== undefined) updateData.title = updateFields.title;
  if (updateFields.description !== undefined) updateData.description = updateFields.description;
  if (updateFields.imageUrl !== undefined) updateData.imageUrl = updateFields.imageUrl;
  if (updateFields.type !== undefined) updateData.type = updateFields.type;
  if (updateFields.order !== undefined) updateData.order = updateFields.order;

  // Handle cropData
  if (updateFields.cropData !== undefined) {
    if (updateFields.cropData === null) {
      updateData.cropData = Prisma.DbNull;
    } else {
      updateData.cropData = JSON.parse(
        JSON.stringify(updateFields.cropData)
      ) as Prisma.InputJsonValue;
    }
  }

  // Handle file relation
  if (updateFields.fileId !== undefined) {
    if (updateFields.fileId) {
      updateData.file = { connect: { id: updateFields.fileId } };
    } else {
      updateData.file = { disconnect: true };
    }
  }

  return prisma.card.update({
    where: { id },
    data: updateData,
    include: {
      file: true,
    },
  });
}

// Delete a card
export async function deleteCard(id: string) {
  return prisma.card.delete({
    where: { id },
    include: {
      file: true,
    },
  });
}

// Re-export the types from schemas.ts for convenience
export type { CreateCardInput, UpdateCardInput };
