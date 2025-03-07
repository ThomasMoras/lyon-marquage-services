import { NextResponse } from "next/server";
import { deleteSection } from "../service";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    console.log("Attempting to delete section with ID:", id);
    const section = await deleteSection(id);
    return NextResponse.json(section);
  } catch (error) {
    console.error("Error deleting section:", error);
    return NextResponse.json({ error: "Failed to delete section" }, { status: 500 });
  }
}
