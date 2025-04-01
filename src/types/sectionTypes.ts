import { SectionType } from "@prisma/client";

export interface Section {
  id: string;
  title?: string;
  content?: string;
  description?: string;
  imageUrl?: string;
  imageLeft?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSectionInput {
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  imageLeft?: boolean;
  order?: number;
}

export interface UpdateSectionInput extends Partial<CreateSectionInput> {
  id: string;
}

export interface EditableSectionCardProps {
  pageSection: SectionType;
  section: Section;
  isAdmin?: boolean;
  onSave: (updated: Section) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export interface SectionContainerProps {
  sections: Section[];
  onSave: (section: Section) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAdd: () => Promise<void>;
  pageSection: SectionType;
  isAdmin?: boolean;
}
