"use client";
import { CollectionSection } from "@/components/shared/editable/CollectionSection";
import { PageLayout } from "@/components/shared/PageLayout";
import { PageSectionType } from "@/types/commonTypes";

export default function ObjetsPublicitaires() {
  const pageSection: PageSectionType = "objets_publicitaires";

  return (
    <div className="flex flex-col min-h-screen">
      <section>
        <PageLayout pageSection={pageSection} />
      </section>

      <CollectionSection pageSection={pageSection} />
    </div>
  );
}
