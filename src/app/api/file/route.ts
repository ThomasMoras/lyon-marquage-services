import { NextResponse } from "next/server";
import { createServerSideSupabaseClient, STORAGE_BUCKET } from "@/lib/supabase";

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

    // Create a unique file name to avoid conflicts
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
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

    return NextResponse.json({
      fileUrl: publicUrlData.publicUrl,
      path: filePath, // Store the path for later reference (delete, update)
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
    // Get Supabase client
    const supabase = createServerSideSupabaseClient();

    // List files from a folder
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
    const images = await Promise.all(
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

    return NextResponse.json({ images });
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

    return NextResponse.json({ success: true, message: "File deleted successfully" });
  } catch (error: unknown) {
    console.error("Failed to delete file:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Failed to delete file: ${errorMessage}` }, { status: 500 });
  }
}
