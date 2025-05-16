import { z } from "zod";
import { SectionType } from "@prisma/client";

// Define position schema for reuse
export const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

// Define crop data schema for reuse
export const cropDataSchema = z.object({
  scale: z.number().default(1),
  position: positionSchema.default({ x: 0, y: 0 }),
  rotation: z.number().default(0),
});

// Create a mapping from string literals to SectionType enum
// This ensures type safety when transforming strings to enum values
const sectionTypeMap: Record<string, SectionType> = {
  "HOME": "HOME" as SectionType,
  "SERIGRAPHIE": "SERIGRAPHIE" as SectionType,
  "BRODERIE": "BRODERIE" as SectionType,
  "IMPRESSION": "IMPRESSION" as SectionType,
  "FLOCAGE": "FLOCAGE" as SectionType,
  "OBJETS_PUBLICITAIRES": "OBJETS_PUBLICITAIRES" as SectionType,
  "IMPRIMERIE": "IMPRIMERIE" as SectionType,
  "ENSEIGNES": "ENSEIGNES" as SectionType,
};

// Array of valid section type keys for validation
const sectionTypeKeys = Object.keys(sectionTypeMap);

// Create carousel schema
export const createCarouselSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  image: z.string().min(1, "Image is required"),
  buttonText: z.string(),
  buttonLink: z.string(),
  type: z
    .string()
    .transform((val) => val.toUpperCase())
    .refine((val) => sectionTypeKeys.includes(val), {
      message: `Type must be one of: ${sectionTypeKeys.join(", ")}`,
    })
    .transform((val) => sectionTypeMap[val]), // Safer transformation to enum
  order: z.number().default(0),
  fileId: z.string().nullable().optional(),
  cropData: cropDataSchema.optional(),
});

// Update carousel schema
export const updateCarouselSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  type: z
    .string()
    .optional()
    .transform((val) => (val ? val.toUpperCase() : undefined))
    .refine((val) => val === undefined || sectionTypeKeys.includes(val as string), {
      message: `Type must be one of: ${sectionTypeKeys.join(", ")}`,
    })
    .transform((val) => (val ? sectionTypeMap[val as string] : undefined)), // Safer transformation to enum
  order: z.number().optional(),
  fileId: z.string().nullable().optional(),
  cropData: cropDataSchema.optional(),
});

// Delete carousel schema
export const deleteCarouselSchema = z.object({
  id: z.string(),
});

// Export type helpers for use in service file
export type CreateCarouselInput = z.infer<typeof createCarouselSchema>;
export type UpdateCarouselInput = z.infer<typeof updateCarouselSchema>;
export type DeleteCarouselInput = z.infer<typeof deleteCarouselSchema>;
