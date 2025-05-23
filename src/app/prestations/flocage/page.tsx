"use client";
import { CollectionSection } from "@/components/shared/Card/CollectionSection";
import FAQ from "@/components/shared/FAQ";
import { PageLayout } from "@/components/shared/PageLayout";
import SchemaOrg from "@/components/shared/SchemaOrg";
import { SEOMetadata } from "@/components/shared/SEOMetadata";
import { flocageFAQItems } from "@/constants/faqData";
import { SectionType } from "@prisma/client";
import { Link } from "lucide-react";

export default function Flocage() {
  const pageSection: SectionType = SectionType.FLOCAGE;

  return (
    <div className="flex flex-col min-h-screen">
      <SEOMetadata pageSection={pageSection} />
      <SchemaOrg type={pageSection} />
      <section>
        <PageLayout pageSection={pageSection} />
      </section>

      <CollectionSection pageSection={pageSection} />

      <FAQ
        title="Tout savoir sur le flocage"
        items={flocageFAQItems}
        sectionKeywords="flocage textile, flocage vêtement, flocage personnalisé, marquage textile, flocage lyon, flocage saint priest"
      />

      <section className="container mx-auto py-8 px-4 mb-12">
        <h2 className="text-xl font-semibold mb-4">Nos autres techniques de marquage textile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            href="/prestations/serigraphie"
            className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100"
          >
            <h3 className="font-semibold">Sérigraphie sur textile</h3>
            <p className="text-sm mt-2">Impression durable et qualitative pour grandes séries</p>
          </Link>
          <Link
            href="/prestations/broderie"
            className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100"
          >
            <h3 className="font-semibold">Broderie personnalisée</h3>
            <p className="text-sm mt-2">Finition premium pour vos vêtements professionnels</p>
          </Link>
          <Link
            href="/prestations/impression"
            className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100"
          >
            <h3 className="font-semibold">Impression textile</h3>
            <p className="text-sm mt-2">Idéal pour les designs détaillés et les petites séries</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
