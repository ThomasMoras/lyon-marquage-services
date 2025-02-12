import { NextResponse } from "next/server";
import { deleteCarousel } from "../service";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    console.log("Deleting carousel with ID:", id); // Pour debug
    const deletedCarousel = await deleteCarousel(id);
    return NextResponse.json(deletedCarousel);
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete carousel" }, { status: 500 });
  }
}
