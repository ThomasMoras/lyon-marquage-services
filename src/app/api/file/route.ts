import { NextResponse } from "next/server";
import { createServerSideSupabaseClient, STORAGE_BUCKET } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const folder = (formData.get("folder") as string).toLowerCase();

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    const supabase = createServerSideSupabaseClient();

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract image metadata using sharp
    let metadata;
    try {
      metadata = await sharp(buffer).metadata();
    } catch (error) {
      console.error("Error extracting image metadata:", error);
      return NextResponse.json({ error: "Invalid image file" }, { status: 400 });
    }

    // Create a unique file name with UUID to avoid conflicts
    const originalFilename = file.name.replace(/\s+/g, "-");
    const fileExt = originalFilename.split(".").pop() || "jpg";
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload file to Supabase Storage
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
    const fileUrl = publicUrlData.publicUrl;

    // Save metadata to database
    const fileMetadata = await prisma.fileMetadata.create({
      data: {
        filename: fileName,
        originalName: file.name,
        mimeType: file.type,
        size: buffer.length,
        width: metadata.width,
        height: metadata.height,
        path: filePath,
        url: fileUrl,
      },
    });

    return NextResponse.json({
      fileUrl: fileUrl,
      path: filePath,
      fileId: fileMetadata.id,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        size: buffer.length,
        mimeType: file.type,
      },
    });
  } catch (error: unknown) {
    console.error("Upload failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Upload failed: ${errorMessage}` }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder");

  if (!folder) {
    return NextResponse.json({ error: "Folder parameter required" }, { status: 400 });
  }

  try {
    // First try to get images from our database which includes metadata
    const images = await prisma.fileMetadata.findMany({
      where: {
        path: {
          startsWith: `${folder}/`,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // If we have metadata records, return those
    if (images.length > 0) {
      return NextResponse.json({
        images: images.map((img) => ({
          url: img.url,
          path: img.path,
          name: img.filename,
          fileId: img.id,
          mimeType: img.mimeType,
          size: img.size,
          width: img.width,
          height: img.height,
          createdAt: img.createdAt.toISOString(),
        })),
      });
    }

    // Fallback to listing directly from Supabase storage if no database records exist
    const supabase = createServerSideSupabaseClient();
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).list(folder, {
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) {
      console.error("Supabase list error:", error);
      return NextResponse.json(
        { error: `Failed to list files: ${error.message}` },
        { status: 500 }
      );
    }

    // Filter only image files and get their public URLs
    const fileList = data || [];
    const supabaseImages = await Promise.all(
      fileList
        .filter((file: { name: string }) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name))
        .map(async (file: { name: string }) => {
          const filePath = `${folder}/${file.name}`;
          const { data: publicUrlData } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(filePath);

          return {
            url: publicUrlData.publicUrl,
            path: filePath,
            name: file.name,
          };
        })
    );

    return NextResponse.json({ images: supabaseImages });
  } catch (error: unknown) {
    console.error("Failed to list files:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Failed to list files: ${errorMessage}` }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get("filePath");

  if (!filePath) {
    return NextResponse.json({ error: "File path required" }, { status: 400 });
  }

  try {
    // First check if file exists in the database
    const fileMetadata = await prisma.fileMetadata.findFirst({
      where: { path: filePath },
      include: {
        carousels: true,
        cards: true,
        sections: true,
      },
    });

    // Get Supabase client
    const supabase = createServerSideSupabaseClient();

    // Delete file from Supabase Storage
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json(
        { error: `Failed to delete file: ${error.message}` },
        { status: 500 }
      );
    }

    // If file was found in database, delete the record
    if (fileMetadata) {
      // Check if file is being used
      const isUsed =
        fileMetadata.carousels.length > 0 ||
        fileMetadata.cards.length > 0 ||
        fileMetadata.sections.length > 0;

      if (isUsed) {
        console.warn(`File ${filePath} is being used but was deleted from storage`);
      }

      // Delete the metadata record
      await prisma.fileMetadata.delete({
        where: { id: fileMetadata.id },
      });
    }

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
      wasReferenced: fileMetadata
        ? fileMetadata.carousels.length > 0 ||
          fileMetadata.cards.length > 0 ||
          fileMetadata.sections.length > 0
        : false,
    });
  } catch (error: unknown) {
    console.error("Failed to delete file:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Failed to delete file: ${errorMessage}` }, { status: 500 });
  }
}

// New PATCH method to update crop data
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { modelType, modelId, fileId, cropData } = body;

    if (!modelType || !modelId || !cropData) {
      return NextResponse.json(
        {
          error: "Model type, model ID, and crop data are required",
        },
        { status: 400 }
      );
    }

    // Update crop data on the appropriate model
    let updatedModel;

    switch (modelType) {
      case "carousel":
        updatedModel = await prisma.carousel.update({
          where: { id: modelId },
          data: {
            cropData,
            fileId: fileId || undefined, // Update fileId if provided
          },
        });
        break;

      case "card":
        updatedModel = await prisma.card.update({
          where: { id: modelId },
          data: {
            cropData,
            fileId: fileId || undefined, // Update fileId if provided
          },
        });
        break;

      case "section":
        updatedModel = await prisma.section.update({
          where: { id: modelId },
          data: {
            cropData,
            fileId: fileId || undefined, // Update fileId if provided
          },
        });
        break;

      default:
        return NextResponse.json({ error: "Invalid model type" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      model: updatedModel,
    });
  } catch (error: unknown) {
    console.error("Error updating crop data:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to update crop data: ${errorMessage}` },
      { status: 500 }
    );
  }
}
