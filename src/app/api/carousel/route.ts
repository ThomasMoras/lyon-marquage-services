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
    // Convertir le type en majuscules avant de créer
    const carouselData = {
      ...data,
      type: data.type.toUpperCase(),
    };
    const carousel = await createCarousel(carouselData);
    return NextResponse.json(carousel);
  } catch (error: unknown) {
    console.error("ERROR IN POST:", error);
    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = (error as { message: string }).message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
