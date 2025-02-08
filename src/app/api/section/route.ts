import { NextResponse } from "next/server";
import { getSections, createSection, updateSection, deleteSection } from "./service";

export async function GET() {
  const sections = await getSections();
  return NextResponse.json(sections);
}

export async function POST(request: Request) {
  const data = await request.json();
  const section = await createSection(data);
  return NextResponse.json(section);
}

export async function PUT(request: Request) {
  const data = await request.json();
  const { id, ...updateData } = data;
  const section = await updateSection(id, updateData);
  return NextResponse.json(section);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const section = await deleteSection(id);
  return NextResponse.json(section);
}
