"use client";
import { CollectionSection } from "@/components/shared/Card/CollectionSection";
import FAQ from "@/components/shared/FAQ";
import { PageLayout } from "@/components/shared/PageLayout";
import SchemaOrg from "@/components/shared/SchemaOrg";
import { SEOMetadata } from "@/components/shared/SEOMetadata";
import { objetsPublicitairesFAQItems } from "@/constants/faqData";
import { SectionType } from "@prisma/client";

export default function ObjetsPublicitaires() {
  const pageSection: SectionType = SectionType.OBJETS_PUBLICITAIRES;

  return (
    <div className="flex flex-col min-h-screen">
      <SEOMetadata pageSection={pageSection} />
      <SchemaOrg type={pageSection} />
      <section>
        <PageLayout pageSection={pageSection} />
      </section>

      <CollectionSection pageSection={pageSection} />

      <FAQ
        title="Tout savoir sur la sérigraphie textile"
        items={objetsPublicitairesFAQItems}
        sectionKeywords="objets publicitaires, marquage publicitaire, goodies entreprise, kakemono, totem, objets promotionnels, objets publicitaires lyon, objets publicitaires saint priest"
      />
    </div>
  );
}
