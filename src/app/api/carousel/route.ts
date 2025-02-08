import { NextResponse } from "next/server";
import { getCarousels, updateCarousel, createCarousel } from "./service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || undefined;
  const carousels = await getCarousels(type);
  return NextResponse.json(carousels);
}

export async function PUT(request: Request) {
  const data = await request.json();
  const carousel = await updateCarousel(data.id, data);
  return NextResponse.json(carousel);
}

export async function POST(request: Request) {
  const data = await request.json();
  const carousel = await createCarousel(data);
  return NextResponse.json(carousel);
}
