import { NextResponse } from "next/server";
import { getCards, createCard, updateCard, deleteCard } from "./service";
import { CreateCardInput, UpdateCardInput } from "@/types/cardTypes";

export async function GET() {
  const cards = await getCards();
  return NextResponse.json(cards);
}

export async function POST(request: Request) {
  const data: CreateCardInput = await request.json();
  console.log("data post reception : ", data);
  const card = await createCard(data);
  return NextResponse.json(card);
}

export async function PUT(request: Request) {
  const data: UpdateCardInput = await request.json();
  const card = await updateCard(data);
  return NextResponse.json(card);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const card = await deleteCard(id);
  return NextResponse.json(card);
}
