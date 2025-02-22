import { PageSectionType } from "./commonTypes";
import { Card as PrismaCard } from "@prisma/client";

// Re-export the Prisma Card type
export type CardType = PrismaCard;

// API-related input types
export interface CreateCardInput {
  title?: string;
  description?: string;
  imageUrl: string;
  order?: number; // Add order property
}

export interface UpdateCardInput extends Partial<CreateCardInput> {
  id: string;
}

// UI Component types
export interface CardItem {
  id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  order?: number; // Add order property
  createdAt?: string; // Add createdAt for fallback sorting
  updatedAt?: string;
}

export interface EditableCardProps {
  card: CardItem;
  onSave: (card: CardItem) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  pageSection: PageSectionType;
  isAdmin?: boolean;
}

export interface CardGridProps {
  cards: CardItem[];
  onSave: (card: CardItem) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAdd: () => Promise<void>;
  pageSection: PageSectionType;
  isAdmin?: boolean;
}
