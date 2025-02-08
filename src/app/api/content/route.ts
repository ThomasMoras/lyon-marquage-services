import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

// GET /api/content?section=home
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    const content = await prisma.content.findMany({
      where: {
        section: section || undefined,
      },
    });

    // Transformer en format plus facile à utiliser
    const contentMap = content.reduce((acc, item) => {
      acc[item.key] = {
        value: item.value,
        type: item.type,
        version: item.version,
      };
      return acc;
    }, {});

    return NextResponse.json(contentMap);
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // const session = await getServerSession();

    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const body = await request.json();
    const { key, value, section } = body;

    // Mise à jour du contenu
    const content = await prisma.content.upsert({
      where: { key },
      update: {
        value,
        version: { increment: 1 },
      },
      create: {
        key,
        value,
        section,
        type: body.type || "text",
      },
    });

    // Optionnel : Sauvegarder l'historique
    await prisma.contentHistory.create({
      data: {
        contentId: content.id,
        value,
        updatedBy: 1,
        // updatedBy: session.user.id,
        version: content.version,
      },
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
