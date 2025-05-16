-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "cropData" JSONB,
ADD COLUMN     "fileId" TEXT;

-- AlterTable
ALTER TABLE "Carousel" ADD COLUMN     "cropData" JSONB,
ADD COLUMN     "fileId" TEXT;

-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "cropData" JSONB,
ADD COLUMN     "fileId" TEXT;

-- CreateTable
CREATE TABLE "FileMetadata" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "path" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FileMetadata_path_key" ON "FileMetadata"("path");

-- CreateIndex
CREATE INDEX "FileMetadata_path_idx" ON "FileMetadata"("path");

-- AddForeignKey
ALTER TABLE "Carousel" ADD CONSTRAINT "Carousel_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileMetadata"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileMetadata"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileMetadata"("id") ON DELETE SET NULL ON UPDATE CASCADE;
