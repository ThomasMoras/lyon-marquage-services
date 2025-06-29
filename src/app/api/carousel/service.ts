import { PrismaClient, SectionType, Prisma } from "@prisma/client";
import { CreateCarouselInput, ReorderCarouselInput, UpdateCarouselInput } from "./schema";

const prisma = new PrismaClient();

// Get carousels, optionally filtered by type
export async function getCarousels(type?: string | null) {
  const whereClause = type ? { type: type as SectionType } : {};

  return prisma.carousel.findMany({
    where: whereClause,
    orderBy: {
      order: "asc",
    },
    include: {
      file: true,
    },
  });
}

// Create a new carousel
export async function createCarousel(data: CreateCarouselInput) {
  // Prepare data for Prisma
  const createData: Prisma.CarouselCreateInput = {
    title: data.title,
    description: data.description,
    image: data.image,
    buttonText: data.buttonText,
    buttonLink: data.buttonLink,
    type: data.type,
    order: data.order,
    contentPosition: data.contentPosition,
    showButtons: data.showButtons,
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

  return prisma.carousel.create({
    data: createData,
    include: {
      file: true,
    },
  });
}

// Update an existing carousel
export async function updateCarousel(data: UpdateCarouselInput) {
  const { id, ...updateFields } = data;
  console.log(updateFields);
  // Prepare update data
  const updateData: Prisma.CarouselUpdateInput = {};

  // Only include fields that are defined
  if (updateFields.title !== undefined) updateData.title = updateFields.title;
  if (updateFields.description !== undefined) updateData.description = updateFields.description;
  if (updateFields.image !== undefined) updateData.image = updateFields.image;
  if (updateFields.buttonText !== undefined) updateData.buttonText = updateFields.buttonText;
  if (updateFields.buttonLink !== undefined) updateData.buttonLink = updateFields.buttonLink;
  if (updateFields.type !== undefined) updateData.type = updateFields.type;
  if (updateFields.order !== undefined) updateData.order = updateFields.order;
  if (updateFields.contentPosition !== undefined)
    updateData.contentPosition = updateFields.contentPosition;
  if (updateFields.showButtons !== undefined) updateData.showButtons = updateFields.showButtons;

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

  return prisma.carousel.update({
    where: { id },
    data: updateData,
    include: {
      file: true,
    },
  });
}

// Delete a carousel
export async function deleteCarousel(id: string) {
  return prisma.carousel.delete({
    where: { id },
    include: {
      file: true,
    },
  });
}

// Add this function to your service.ts file
export async function reorderCarousels(data: ReorderCarouselInput) {
  const { updates, pageSection } = data;

  return prisma.$transaction(async (tx) => {
    const updatePromises = updates.map((update) =>
      tx.carousel.update({
        where: {
          id: update.id,
          type: pageSection,
        },
        data: { order: update.order },
      })
    );

    const updatedCarousels = await Promise.all(updatePromises);
    return updatedCarousels.sort((a, b) => a.order - b.order);
  });
}

// Re-export the types from schema.ts for convenience
export type { CreateCarouselInput, UpdateCarouselInput, ReorderCarouselInput };
