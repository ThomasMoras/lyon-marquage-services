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

      {/* Contenu textuel optimisé pour le mot-clé "sérigraphie sur textile" */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Sérigraphie sur Textile à Lyon</h1>

        <div className="prose max-w-none mb-8">
          <p className="mb-4">
            <strong>Lyon Marquage</strong> est votre spécialiste en{" "}
            <strong>sérigraphie sur textile</strong> à Lyon. Notre équipe d&apos;experts réalise
            l&apos;impression de vos logos, designs et messages sur tous types de textiles avec une
            qualité professionnelle et une durabilité exceptionnelle.
          </p>
          <p className="mb-4">
            Notre atelier, situé à Saint Priest, utilise des techniques de sérigraphie avancées pour
            garantir des résultats parfaits sur vos t-shirts, polos, sweats et autres vêtements
            professionnels.
          </p>
        </div>
      </div>

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
