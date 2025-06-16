import { NextResponse } from "next/server";
import { getCarousels, createCarousel, updateCarousel } from "./service";
import { createCarouselSchema, updateCarouselSchema } from "./schema";
import { handleError, validateRequest } from "@/lib/api-utils";
import { CreateCarouselDTO, UpdateCarouselDTO } from "@/types/carousel";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const carousels = await getCarousels(type);
    return NextResponse.json(carousels);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  const validation = await validateRequest(request, createCarouselSchema);

  if (!validation.success) {
    return validation.response;
  }

  try {
    const carouselData = validation.data as CreateCarouselDTO;
    const carousel = await createCarousel(carouselData);
    return NextResponse.json(carousel);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: Request) {
  console.log(request.body);
  const validation = await validateRequest(request, updateCarouselSchema);

  if (!validation.success) {
    return validation.response;
  }

  try {
    const carouselData = validation.data as UpdateCarouselDTO;
    const carousel = await updateCarousel(carouselData);
    return NextResponse.json(carousel);
  } catch (error) {
    return handleError(error);
  }
}
