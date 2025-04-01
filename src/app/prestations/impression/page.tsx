"use client";
import { CollectionSection } from "@/components/shared/editable/CollectionSection";
import { PageLayout } from "@/components/shared/PageLayout";
import { SectionType } from "@prisma/client";

export default function Impression() {
  const pageSection: SectionType = SectionType.IMPRESSION;

  return (
    <div className="flex flex-col min-h-screen">
      <section>
        <PageLayout pageSection={pageSection} />
      </section>

      <CollectionSection pageSection={pageSection} />
    </div>
  );
}
