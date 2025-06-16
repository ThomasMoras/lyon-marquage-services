import { SectionType } from "@prisma/client";
import { CropData } from "./image";

/**
 * ----------------------------------------
 * API / SERVER TYPES
 * These types are used for database and API interactions
 * ----------------------------------------
 */

/**
 * Base carousel properties shared between create and update operations
 */
export interface CarouselBase {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  type: SectionType;
  order: number;
  showButtons: boolean;
  fileId?: string | null;
  cropData?: CropData;
}

/**
 * Data required to create a new carousel
 */
export type CreateCarouselDTO = CarouselBase;

/**
 * Data required to update an existing carousel
 */
export interface UpdateCarouselDTO extends Partial<CarouselBase> {
  id: string;
}

/**
 * Data returned from API for a carousel
 */
export interface CarouselDTO extends CarouselBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * ----------------------------------------
 * CLIENT / UI TYPES
 * These types are used for React components
 * ----------------------------------------
 */

/**
 * Carousel slide used in UI components
 */
export interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  type: SectionType;
  showButtons: boolean;
  cropData?: CropData;
  fileId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Props for the EditableCarousel component
 */
export interface EditableCarouselProps {
  pageSection: SectionType;
  isAdmin?: boolean;
}
