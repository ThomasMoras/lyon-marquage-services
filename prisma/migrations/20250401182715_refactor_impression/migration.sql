/*
  Warnings:

  - The values [IMPRESSION_TEXTILE,IMPRESSION_TRANSFERT] on the enum `SectionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SectionType_new" AS ENUM ('HOME', 'SERIGRAPHIE', 'BRODERIE', 'IMPRESSION', 'FLOCAGE', 'OBJETS_PUBLICITAIRES', 'IMPRIMERIE', 'ENSEIGNES');
ALTER TABLE "Section" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Carousel" ALTER COLUMN "type" TYPE "SectionType_new" USING ("type"::text::"SectionType_new");
ALTER TABLE "Section" ALTER COLUMN "type" TYPE "SectionType_new" USING ("type"::text::"SectionType_new");
ALTER TYPE "SectionType" RENAME TO "SectionType_old";
ALTER TYPE "SectionType_new" RENAME TO "SectionType";
DROP TYPE "SectionType_old";
ALTER TABLE "Section" ALTER COLUMN "type" SET DEFAULT 'HOME';
COMMIT;
