"use client";
import { CollectionSection } from "@/components/shared/editable/CollectionSection";
import { PageLayout } from "@/components/shared/PageLayout";
import SchemaOrg from "@/components/shared/SchemaOrg";
import { SEOMetadata } from "@/components/shared/SEOMetadata";
import { SectionType } from "@prisma/client";

export default function Broderie() {
  const pageSection: SectionType = SectionType.BRODERIE;

  return (
    <div className="flex flex-col min-h-screen">
      <SEOMetadata pageSection={pageSection} />
      <SchemaOrg type={pageSection} />
      <section>
        <PageLayout pageSection={pageSection} />
      </section>

      <CollectionSection pageSection={pageSection} />
    </div>
  );
}
