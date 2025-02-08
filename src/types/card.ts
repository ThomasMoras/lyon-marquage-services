import { Card } from "@prisma/client";

export type CardType = Card;

export interface CreateCardInput {
  title: string;
  description: string;
  imageUrl: string;
}

export interface UpdateCardInput extends Partial<CreateCardInput> {
  id: string;
}
