import { NextResponse } from "next/server";
import { getSections, createSection, updateSection } from "./service";
import { createSectionSchema, updateSectionSchema } from "./schema";
import { handleError, validateRequest } from "@/lib/api-utils";
import { CreateSectionDTO, UpdateSectionDTO } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const sections = await getSections(type || undefined);
    return NextResponse.json(sections);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  const validation = await validateRequest(request, createSectionSchema);

  if (!validation.success) {
    return validation.response;
  }

  try {
    const data = validation.data as CreateSectionDTO;
    const section = await createSection(data);
    return NextResponse.json(section);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: Request) {
  const validation = await validateRequest(request, updateSectionSchema);

  if (!validation.success) {
    return validation.response;
  }

  try {
    const data = validation.data as UpdateSectionDTO;
    const section = await updateSection(data);
    return NextResponse.json(section);
  } catch (error) {
    return handleError(error);
  }
}
