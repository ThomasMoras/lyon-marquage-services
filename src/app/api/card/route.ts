import { NextResponse } from "next/server";
import { getCards, createCard, updateCard, deleteCard } from "./service";
import { createCardSchema, updateCardSchema, deleteCardSchema } from "./schema";
import { CreateCardDTO, UpdateCardDTO } from "@/types/card";
import { handleError, validateRequest } from "@/lib/api-utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const cards = await getCards(type);
    return NextResponse.json(cards);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  const validation = await validateRequest(request, createCardSchema);
  if (!validation.success) {
    return validation.response;
  }

  try {
    const cardData = validation.data as CreateCardDTO;
    const card = await createCard(cardData);
    return NextResponse.json(card);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: Request) {
  const validation = await validateRequest(request, updateCardSchema);

  if (!validation.success) {
    return validation.response;
  }

  try {
    const cardData = validation.data as UpdateCardDTO;
    const card = await updateCard(cardData);
    return NextResponse.json(card);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: Request) {
  const validation = await validateRequest(request, deleteCardSchema);

  if (!validation.success) {
    return validation.response;
  }

  try {
    const cardData = validation.data as UpdateCardDTO;
    const card = await deleteCard(cardData.id);
    return NextResponse.json(card);
  } catch (error) {
    return handleError(error);
  }
}
