"use client";

import { CollectionSection } from "@/components/shared/editable/CollectionSection";
import { PageLayout } from "@/components/shared/PageLayout";
import { SectionType } from "@prisma/client";
import { SEOMetadata } from "@/components/shared/SEOMetadata";
import SchemaOrg from "@/components/shared/SchemaOrg";
import FAQ from "@/components/shared/FAQ";
import Link from "next/link";
import { serigraphieFAQItems } from "@/constants/faqData";

export default function Serigraphie() {
  const pageSection: SectionType = SectionType.SERIGRAPHIE;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Composants SEO */}
      <SEOMetadata pageSection={pageSection} />
      <SchemaOrg type={pageSection} />

      {/* Contenu dynamique chargé depuis la DB */}
      <section>
        <PageLayout pageSection={pageSection} />
      </section>

      <CollectionSection pageSection={pageSection} />

      {/* Intégration du composant FAQ avec les données spécifiques à la sérigraphie */}
      <FAQ title="Tout savoir sur la sérigraphie textile" items={serigraphieFAQItems} />

      {/* Section de liens internes pour le maillage SEO */}
      <section className="container mx-auto py-8 px-4 mb-12">
        <h2 className="text-xl font-semibold mb-4">Nos autres techniques de marquage textile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/prestations/flocage" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
            <h3 className="font-semibold">Flocage textile</h3>
            <p className="text-sm mt-2">Effet velours et texture en relief pour vos textiles</p>
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
