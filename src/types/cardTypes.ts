import { Card as PrismaCard } from "@prisma/client";
import { SectionType } from "@prisma/client";

// Re-export the Prisma Card type
export type CardType = PrismaCard;

// API-related input types
export interface CreateCardInput {
  title: string;
  description: string;
  imageUrl: string;
  type: SectionType;
  order?: number;
}

export interface UpdateCardInput {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  type?: SectionType;
  order?: number;
}

// UI Component types
export interface CardItem {
  id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  type: SectionType;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EditableCardProps {
  card: CardItem;
  onSave: (card: CardItem) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  type: SectionType;
  isAdmin?: boolean;
  isNewCard: boolean;
}

export interface CardGridProps {
  cards: CardItem[];
  onSave: (card: CardItem) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAdd: () => Promise<void>;
  pageSection: SectionType;
  isAdmin?: boolean;
}
