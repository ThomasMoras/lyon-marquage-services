import { PrismaClient, SectionType, Prisma } from "@prisma/client";
import { CreateSectionInput, UpdateSectionInput } from "./schema";

const prisma = new PrismaClient();

// Get sections, optionally filtered by type
export async function getSections(type?: string | undefined) {
  const whereClause = type ? { type: type.toUpperCase() as SectionType } : {};

  return prisma.section.findMany({
    where: whereClause,
    orderBy: {
      order: "asc",
    },
    include: {
      file: true,
    },
  });
}

// Get a single section by ID
export async function getSection(id: string) {
  return prisma.section.findUnique({
    where: { id },
    include: {
      file: true,
    },
  });
}

// Create a new section
export async function createSection(data: CreateSectionInput) {
  // Prepare data for Prisma
  const createData: Prisma.SectionCreateInput = {
    title: data.title,
    description: data.description,
    imageUrl: data.imageUrl,
    imageLeft: data.imageLeft ?? true,
    type: data.type,
    order: data.order || 0,
  };

  // Handle JSON data
  if (data.cropData) {
    createData.cropData = JSON.parse(JSON.stringify(data.cropData)) as Prisma.InputJsonValue;
  }

  // Handle file relation
  if (data.fileId) {
    createData.file = {
      connect: { id: data.fileId },
    };
  }

  return prisma.section.create({
    data: createData,
    include: {
      file: true,
    },
  });
}

// Update an existing section
export async function updateSection(data: UpdateSectionInput) {
  const { id, ...updateFields } = data;

  // Prepare update data
  const updateData: Prisma.SectionUpdateInput = {};

  // Only include fields that are defined
  if (updateFields.title !== undefined) updateData.title = updateFields.title;
  if (updateFields.description !== undefined) updateData.description = updateFields.description;
  if (updateFields.imageUrl !== undefined) updateData.imageUrl = updateFields.imageUrl;
  if (updateFields.imageLeft !== undefined) updateData.imageLeft = updateFields.imageLeft;
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

  return prisma.section.update({
    where: { id },
    data: updateData,
    include: {
      file: true,
    },
  });
}

// Delete a section
export async function deleteSection(id: string) {
  return prisma.section.delete({
    where: { id },
    include: {
      file: true,
    },
  });
}

// Re-export the types from schema.ts for convenience
export type { CreateSectionInput, UpdateSectionInput };
