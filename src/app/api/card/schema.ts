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

// Define crop options schema for backward compatibility
export const cropOptionsSchema = z
  .object({
    scale: z.number().default(1),
    position: positionSchema.default({ x: 0, y: 0 }),
  })
  .optional();

// Create card schema
export const createCardSchema = z.object({
  title: z.string().optional().default(""),
  description: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
  type: z.nativeEnum(SectionType, {
    errorMap: () => {
      return { message: `Invalid type. Must be one of: ${Object.values(SectionType).join(", ")}` };
    },
  }),
  order: z.number().optional().default(0),
  fileId: z.string().nullable().optional(),
  cropData: cropDataSchema.optional(),
  cropOptions: cropOptionsSchema.optional(),
});

// Update card schema (requires ID)
export const updateCardSchema = createCardSchema.extend({
  id: z.string(),
});

// Delete card schema
export const deleteCardSchema = z.object({
  id: z.string(),
});

// Export type helpers for use in other files
export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type DeleteCardInput = z.infer<typeof deleteCardSchema>;
