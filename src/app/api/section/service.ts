import prisma from "@/lib/prisma";
import { SectionType } from "@prisma/client";
import { Section } from "@prisma/client";

export async function getSections(type?: string) {
  console.log(type);
  const sections = await prisma.section.findMany({
    where: type
      ? {
          type: type.toUpperCase() as SectionType,
        }
      : undefined,
    orderBy: {
      createdAt: "asc",
    },
  });
  console.log("Sections retrieved:", sections);
  return sections;
}

export async function getSection(id: string) {
  return await prisma.section.findUnique({
    where: { id },
  });
}

export async function createSection(data: Omit<Section, "id" | "createdAt" | "updatedAt">) {
  return await prisma.section.create({
    data,
  });
}

export async function updateSection(id: string, data: Partial<Section>) {
  return await prisma.section.update({
    where: { id },
    data,
  });
}

export async function deleteSection(id: string) {
  return await prisma.section.delete({
    where: { id },
  });
}
