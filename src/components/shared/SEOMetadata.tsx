"use client";

import Head from "next/head";
import { usePathname } from "next/navigation";
import { SectionType } from "@prisma/client";

// Mapping des types de section avec leurs métadonnées SEO optimisées
const sectionMetadata: Record<
  SectionType,
  { title: string; description: string; keywords: string }
> = {
  // Ajoutez toutes vos sections existantes avec des métadonnées optimisées
  SERIGRAPHIE: {
    title: "Sérigraphie sur Textile à Lyon | Lyon Marquage Service",
    description:
      "Spécialiste de la sérigraphie sur textile à Lyon. Impression de qualité sur t-shirts, polos et vêtements professionnels. Service sur mesure pour entreprises.",
    keywords: "sérigraphie, sérigraphie sur textile, sérigraphie lyon, impression textile",
  },
  BRODERIE: {
    title: "Broderie Personnalisée à Lyon | Lyon Marquage Service",
    description:
      "Service de broderie professionnelle à Lyon pour vos vêtements d'entreprise. Logos, emblèmes et textes brodés avec une finition de qualité.",
    keywords: "broderie, broderie lyon, broderie personnalisée, broderie vêtements",
  },
  IMPRESSION: {
    title: "Impression Textile à Lyon | Service d'impression professionnel",
    description:
      "Impression numérique sur textile à Lyon. Idéal pour les petites séries et designs complexes. Qualité professionnelle pour vos t-shirts et vêtements personnalisés.",
    keywords: "impression textile, impression t-shirt, impression numérique, impression lyon",
  },
  FLOCAGE: {
    title: "Flocage Textile à Lyon | Marquage velours professionnel",
    description:
      "Service de flocage textile à Lyon. Effet velours et texture en relief pour vos vêtements personnalisés, sportifs et professionnels.",
    keywords: "flocage textile, flocage lyon, flocage t-shirt, marquage velours",
  },
  OBJETS_PUBLICITAIRES: {
    title: "Objets Publicitaires Personnalisés à Lyon | Marquage publicitaire",
    description:
      "Spécialiste des objets publicitaires à Lyon. Marquage publicitaire sur goodies, cadeaux d'entreprise et supports de communication pour valoriser votre marque.",
    keywords: "objets publicitaires, marquage publicitaire, goodies entreprise, totem, kakemono",
  },
  HOME: {
    title: "Lyon Marquage | Sérigraphie, Flocage et Marquage Publicitaire à Lyon",
    description:
      "Entreprise spécialisée en marquage textile à Lyon. Sérigraphie, flocage, broderie et objets publicitaires pour entreprises et associations. Service local et réactif.",
    keywords: "marquage textile lyon, sérigraphie, flocage textile, marquage publicitaire",
  },
  ENSEIGNES: {
    title: "Enseignes et Signalétique à Lyon | Lyon Marquage",
    description:
      "Création d'enseignes et signalétique professionnelle à Lyon. Solutions complètes pour votre identité visuelle extérieure et intérieure.",
    keywords: "enseignes lyon, signalétique, enseigne lumineuse, signalétique entreprise",
  },
  IMPRIMERIE: {
    title: "Imprimerie et Personnalisation de t-shirts à Lyon | Lyon Marquage",
    description:
      "Services d'imprimerie professionnels à Lyon. Impression et personnalisation de t-shirts, supports marketing et communication d'entreprise.",
    keywords:
      "imprimerie lyon, personnalisation t-shirt, impression textile, tee-shirt personnalisé",
  },
};

interface SEOMetadataProps {
  pageSection?: SectionType;
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
}

export function SEOMetadata({
  pageSection,
  title: customTitle,
  description: customDescription,
  keywords: customKeywords,
  canonical: customCanonical,
}: SEOMetadataProps) {
  // Récupérer le pathname actuel pour la balise canonique
  const pathname = usePathname();
  const baseUrl = "https://www.lyonmarquage.fr";

  // Déterminer le titre, la description et les mots-clés à utiliser
  let title = customTitle || "";
  let description = customDescription || "";
  let keywords = customKeywords || "";
  let canonicalUrl = customCanonical ? `${baseUrl}${customCanonical}` : `${baseUrl}${pathname}`;

  // Si un pageSection est fourni, utiliser les métadonnées prédéfinies
  if (pageSection && sectionMetadata[pageSection]) {
    // Utiliser les valeurs personnalisées ou les valeurs prédéfinies
    title = customTitle || sectionMetadata[pageSection].title;
    description = customDescription || sectionMetadata[pageSection].description;
    keywords = customKeywords || sectionMetadata[pageSection].keywords;
  }

  return (
    <Head>
      {/* Balises title et meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Balise canonique - cruciale pour résoudre votre problème d'indexation */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Lyon Marquage" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
}
