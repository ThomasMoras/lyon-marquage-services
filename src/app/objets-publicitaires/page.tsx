"use client";
import { CollectionSection } from "@/components/shared/editable/CollectionSection";
import { PageLayout } from "@/components/shared/PageLayout";
import { SectionType } from "@prisma/client";

export default function ObjetsPublicitaires() {
  const pageSection: SectionType = SectionType.OBJETS_PUBLICITAIRES;

  return (
    <div className="flex flex-col min-h-screen">
      <section>
        <PageLayout pageSection={pageSection} />
      </section>

      <CollectionSection pageSection={pageSection} />
    </div>
  );
}
