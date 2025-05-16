// types/section.ts
import { SectionType } from "@prisma/client";
import { CropData } from "./image";

/**
 * ----------------------------------------
 * API / SERVER TYPES
 * These types are used for database and API interactions
 * ----------------------------------------
 */

/**
 * Base section properties shared between create and update operations
 */
export interface SectionBase {
  title: string;
  description: string;
  content?: string;
  imageUrl: string;
  imageLeft: boolean;
  type: SectionType;
  order?: number;
  fileId?: string | null;
  cropData?: CropData;
}

/**
 * Data required to create a new section
 */
export type CreateSectionDTO = SectionBase;

/**
 * Data required to update an existing section
 */
export interface UpdateSectionDTO extends Partial<SectionBase> {
  id: string;
}

/**
 * Data returned from API for a section
 */
export interface SectionDTO extends SectionBase {
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
 * Section item used in UI components
 */
export interface Section {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageLeft: boolean;
  type: SectionType;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  fileId?: string | null;
  cropData?: CropData;
}

/**
 * Props for the EditableSectionCard component
 */
export interface EditableSectionCardProps {
  section: Section;
  onSave: (section: Section) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  pageSection: SectionType;
  isAdmin?: boolean;
}

/**
 * Props for the SectionContainer component
 */
export interface SectionContainerProps {
  sections: Section[];
  onSave: (section: Section) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAdd: () => Promise<void>;
  pageSection: SectionType;
  isAdmin?: boolean;
}
