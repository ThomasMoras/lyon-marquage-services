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
  try {
    const data = await request.json();
    console.log("REQUEST BODY:", data);

    // Convertir le type en majuscules avant de créer
    const carouselData = {
      ...data,
      type: data.type.toUpperCase(),
    };
    console.log("PROCESSED DATA:", carouselData);
    const carousel = await createCarousel(carouselData);
    console.log("CREATED CAROUSEL:", carousel);

    return NextResponse.json(carousel);
  } catch (error) {
    console.error("ERROR IN POST:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
