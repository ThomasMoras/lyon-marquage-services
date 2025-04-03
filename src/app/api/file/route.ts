import { writeFile, mkdir, readdir, unlink } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const folder = (formData.get("folder") as string).toLocaleLowerCase();

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", folder);
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      fileUrl: `/${folder}/${fileName}`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed : " + error }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder");

  if (!folder) {
    return NextResponse.json({ error: "Folder parameter required" }, { status: 400 });
  }

  try {
    const dirPath = join(process.cwd(), "public", folder);
    const files = await readdir(dirPath);
    const images = files
      .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .map((file) => `/${folder}/${file}`);

    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read directory : " + error }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get("filePath");

  if (!filePath) {
    return NextResponse.json({ error: "File path required" }, { status: 400 });
  }

  // Sécuriser le chemin pour éviter les attaques par traversée de répertoire
  const normalizedPath = path.normalize(filePath);
  if (normalizedPath.includes("..")) {
    return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
  }

  try {
    // Chemin complet du fichier
    const fullPath = join(process.cwd(), "public", normalizedPath);

    // Vérifier si le fichier existe
    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Supprimer le fichier
    await unlink(fullPath);

    return NextResponse.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete file: " + error }, { status: 500 });
  }
}
