import { NextResponse } from "next/server";
import { handleError, validateRequest } from "@/lib/api-utils";
import { ReorderCarouselInput, reorderCarouselSchema } from "../schema";
import { reorderCarousels } from "../service";

export async function PUT(request: Request) {
  const validation = await validateRequest(request, reorderCarouselSchema);

  if (!validation.success) {
    return validation.response;
  }

  try {
    const reorderData = validation.data as ReorderCarouselInput;
    const result = await reorderCarousels(reorderData);
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}
