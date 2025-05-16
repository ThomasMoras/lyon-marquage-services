import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function migrateImageRelationships() {
  console.log("Starting migration of image relationships...");

  // Process carousel images
  await processCarousels();

  // Process section images
  await processSections();

  // Process card images
  await processCards();

  console.log("Migration completed successfully");
}

async function processCarousels() {
  console.log("Processing carousel images...");
  const carousels = await prisma.carousel.findMany({
    where: {
      fileId: null,
      image: { not: "" },
    },
  });

  console.log(`Found ${carousels.length} carousels to process`);

  for (const carousel of carousels) {
    try {
      // Extract path from URL
      const path = extractPathFromUrl(carousel.image);
      if (!path) continue;

      // Find or create FileMetadata
      const fileMetadata = await findOrCreateFileMetadata(path, carousel.image);

      // Update carousel with fileId
      await prisma.carousel.update({
        where: { id: carousel.id },
        data: { fileId: fileMetadata.id },
      });

      console.log(`Updated carousel ${carousel.id} with fileId ${fileMetadata.id}`);
    } catch (err) {
      console.error(`Error processing carousel ${carousel.id}:`, err);
    }
  }
}

async function processSections() {
  console.log("Processing section images...");
  const sections = await prisma.section.findMany({
    where: {
      fileId: null,
      imageUrl: { not: "" },
    },
  });

  console.log(`Found ${sections.length} sections to process`);

  for (const section of sections) {
    try {
      // Extract path from URL
      const path = extractPathFromUrl(section.imageUrl);
      if (!path) continue;

      // Find or create FileMetadata
      const fileMetadata = await findOrCreateFileMetadata(path, section.imageUrl);

      // Update section with fileId
      await prisma.section.update({
        where: { id: section.id },
        data: { fileId: fileMetadata.id },
      });

      console.log(`Updated section ${section.id} with fileId ${fileMetadata.id}`);
    } catch (err) {
      console.error(`Error processing section ${section.id}:`, err);
    }
  }
}

async function processCards() {
  console.log("Processing card images...");
  const cards = await prisma.card.findMany({
    where: {
      fileId: null,
      imageUrl: { not: "" },
    },
  });

  console.log(`Found ${cards.length} cards to process`);

  for (const card of cards) {
    try {
      // Extract path from URL
      const path = extractPathFromUrl(card.imageUrl);
      if (!path) continue;

      // Find or create FileMetadata
      const fileMetadata = await findOrCreateFileMetadata(path, card.imageUrl);

      // Update card with fileId
      await prisma.card.update({
        where: { id: card.id },
        data: { fileId: fileMetadata.id },
      });

      console.log(`Updated card ${card.id} with fileId ${fileMetadata.id}`);
    } catch (err) {
      console.error(`Error processing card ${card.id}:`, err);
    }
  }
}

async function findOrCreateFileMetadata(path: string, url: string) {
  // Check if metadata already exists
  let fileMetadata = await prisma.fileMetadata.findFirst({
    where: { path },
  });

  if (!fileMetadata) {
    console.log(`Creating new file metadata for path ${path}`);

    // Extract filename
    const filename = path.split("/").pop() || "";

    // Try to get file info from Supabase
    try {
      const { data, error } = await supabase.storage.from("lyonmarquage").download(path);

      if (error) throw new Error(`Supabase error: ${error.message}`);

      // Create metadata entry with file info
      fileMetadata = await prisma.fileMetadata.create({
        data: {
          filename,
          originalName: filename,
          mimeType: data.type || "image/jpeg",
          size: data.size || 0,
          width: null, // Would need to use Sharp to get this
          height: null, // Would need to use Sharp to get this
          path,
          url,
        },
      });
    } catch (err) {
      console.log(`Error downloading file from Supabase, creating basic metadata`);

      // Create basic metadata entry without file info
      fileMetadata = await prisma.fileMetadata.create({
        data: {
          filename,
          originalName: filename,
          mimeType: guessImageMimeType(filename),
          size: 0,
          width: null,
          height: null,
          path,
          url,
        },
      });
    }
  }

  return fileMetadata;
}

// Helper to extract the path from your Supabase URL format
function extractPathFromUrl(url: string): string {
  // Example: https://idpdoknycqsflntwtsjo.supabase.co/storage/v1/object/public/lyonmarquage/images/home/image.jpg
  // Extract: images/home/image.jpg
  const matches = url.match(/lyonmarquage\/(.+)$/);
  return matches ? matches[1] : "";
}

// Simple MIME type guess based on extension
function guessImageMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";

  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

migrateImageRelationships()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
