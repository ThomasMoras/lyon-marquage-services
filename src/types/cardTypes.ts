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
  cropOptions?: ImageCropOptions;
}

export interface UpdateCardInput {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  type?: SectionType;
  order?: number;
  cropOptions?: ImageCropOptions;
}

export interface ImageCropOptions {
  scale: number;
  position: {
    x: number;
    y: number;
  };
}

export interface CardItem {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  type: SectionType;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  cropOptions?: ImageCropOptions;
}

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

export interface CardGridProps {
  cards: CardItem[];
  onSave: (card: CardItem) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAdd: () => Promise<void>;
  pageSection: SectionType;
  isAdmin?: boolean;
}

export interface QuickImageSelectorProps {
  imageUrl?: string;
  onCropChange: (cropOptions: ImageCropOptions) => void;
  currentCropOptions?: ImageCropOptions;
  onClose: () => void;
}

export interface CardFormProps {
  editedCard: CardItem;
  setEditedCard: React.Dispatch<React.SetStateAction<CardItem>>;
  type: SectionType;
  resetCrop: () => void;
  setShowCropMode: React.Dispatch<React.SetStateAction<boolean>>;
  handleSave: () => Promise<void>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CardDisplayProps {
  editedCard: CardItem;
  cropOptions: ImageCropOptions;
  toggleExpand: (e: React.MouseEvent) => void;
  isAdmin: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => Promise<void>;
}

export interface CardDeleteDialogProps {
  onDelete: () => Promise<void>;
}

export interface ImageCropperProps {
  editedCard: CardItem;
  cropOptions: ImageCropOptions;
  setCropOptions: React.Dispatch<React.SetStateAction<ImageCropOptions>>;
  resetCrop: () => void;
  setShowCropMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CardModalProps {
  cardToShow: CardItem;
  visualCurrentCard: CardItem | null;
  visualCards: CardItem[];
  toggleExpand: (e: React.MouseEvent) => void;
  navigateToCard: (direction: "next" | "prev") => void;
}
