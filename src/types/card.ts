import { SectionType } from "@prisma/client";
import { CropData } from "./image";

/**
 * ----------------------------------------
 * API / SERVER TYPES
 * These types are used for database and API interactions
 * ----------------------------------------
 */

/**
 * Base card properties shared between create and update operations
 */
export interface CardBase {
  title: string;
  description: string;
  imageUrl: string;
  type: SectionType;
  order?: number;
  fileId?: string | null;
  cropData?: CropData;
}

/**
 * Data required to create a new card
 */
export type CreateCardDTO = CardBase;

/**
 * Data required to update an existing card
 */
export interface UpdateCardDTO extends CardBase {
  id: string;
}

/**
 * Data returned from API for a card
 */
export interface CardDTO extends CardBase {
  id: string;
  createdAt: string;
  updatedAt: string;
  // Server doesn't need to store cropOptions, only cropData
}

/**
 * ----------------------------------------
 * CLIENT / UI TYPES
 * These types are used for React components
 * ----------------------------------------
 */

/**
 * Card item interface used in the UI
 */
export interface CardItem {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  type: SectionType;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  fileId?: string | null;
  cropData?: CropData;
}

/**
 * Props for the EditableCard component
 */
export interface EditableCardProps {
  card: CardItem;
  onSave: (card: CardItem) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  type: SectionType;
  isAdmin?: boolean;
  isNewCard?: boolean;
  allCards?: CardItem[];
  onNavigate?: (cardId: string) => void;
  chevronOffset?: number;
}

/**
 * Props for the CardDisplay component
 */
export interface CardDisplayProps {
  editedCard: CardItem;
  toggleExpand: (e: React.MouseEvent) => void;
  isAdmin: boolean;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete?: () => Promise<void>;
}

/**
 * Props for the CardModal component
 */
export interface CardModalProps {
  cardToShow: CardItem;
  visualCurrentCard: CardItem | null;
  visualCards: CardItem[];
  toggleExpand: (e: React.MouseEvent) => void;
  navigateToCard: (direction: "next" | "prev") => void;
}

/**
 * Props for the CardGrid component
 */
export interface CardGridProps {
  cards: CardItem[];
  onSave: (card: CardItem) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAdd: () => Promise<void>;
  pageSection: SectionType;
  isAdmin?: boolean;
}
