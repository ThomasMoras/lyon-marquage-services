"use client";
import { CollectionSection } from "@/components/shared/Card/CollectionSection";
import FAQ from "@/components/shared/FAQ";
import { PageLayout } from "@/components/shared/PageLayout";
import SchemaOrg from "@/components/shared/SchemaOrg";
import { SEOMetadata } from "@/components/shared/SEOMetadata";
import { enseignesFAQItems } from "@/constants/faqData";
import { SectionType } from "@prisma/client";

export default function Enseignes() {
  const pageSection: SectionType = SectionType.ENSEIGNES;

  return (
    <div className="flex flex-col min-h-screen">
      <SEOMetadata pageSection={pageSection} />
      <SchemaOrg type={pageSection} />
      <section>
        <PageLayout pageSection={pageSection} />
      </section>

      <CollectionSection pageSection={pageSection} />
      <FAQ
        title="Tout savoir sur les enseignes et la signalétique"
        items={enseignesFAQItems}
        sectionKeywords="enseignes lyon, enseignes saint priest,lettrage adhésif, marquage de véhicule, habillage de façade, totem, signalétique, lettrage publicitaire"
      />
    </div>
  );
}
