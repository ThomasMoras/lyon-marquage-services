"use client";

import { SectionType } from "@prisma/client";

interface GeoCoordinates {
  "@type": "GeoCoordinates";
  latitude: number;
  longitude: number;
}

interface PostalAddress {
  "@type": "PostalAddress";
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  addressRegion: string;
  addressCountry: string;
}

interface OpeningHoursSpecification {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string[];
  opens: string;
  closes: string;
}

interface LocalBusiness {
  "@context": "https://schema.org";
  "@type": "LocalBusiness";
  name: string;
  image: string;
  "@id": string;
  url: string;
  telephone: string;
  priceRange: string;
  address: PostalAddress;
  geo: GeoCoordinates;
  openingHoursSpecification: OpeningHoursSpecification[];
}

interface Service {
  "@context": "https://schema.org";
  "@type": "Service";
  name: string;
  description: string;
  url: string;
  provider: LocalBusiness;
  areaServed: {
    "@type": "City";
    name: string;
  };
}

type SchemaOrgProps = {
  type?: SectionType;
  title?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
};

export default function SchemaOrg({
  type,
  title,
  description,
  url = "https://www.lyonmarquage.fr",
  imageUrl = "/logo.png",
}: SchemaOrgProps) {
  const businessSchema: LocalBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Lyon Marquage Service",
    image: imageUrl,
    "@id": "https://www.lyonmarquage.fr/#organization",
    url: "https://www.lyonmarquage.fr",
    telephone: "+33951522880",
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: "89 Rue du Dauphiné",
      addressLocality: "Saint-Priest",
      postalCode: "69800",
      addressRegion: "Rhône-Alpes",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 45.7151002783356,
      longitude: 4.914273330584827,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
  };

  let schemaData: LocalBusiness | Service = businessSchema;

  if (type) {
    const serviceTitle = title || getServiceTitle(type);
    const serviceDescription = description || getServiceDescription(type);
    const serviceUrl = url || `https://www.lyonmarquage.fr/${getServicePath(type)}`;

    schemaData = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: serviceTitle,
      description: serviceDescription,
      url: serviceUrl,
      provider: businessSchema,
      areaServed: {
        "@type": "City",
        name: "Lyon",
      },
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

// Fonctions d'aide pour obtenir le titre, la description et le chemin des services
function getServiceTitle(type: SectionType): string {
  const titles: Record<string, string> = {
    SERIGRAPHIE: "Service de Sérigraphie Professionnelle à Lyon",
    BRODERIE: "Service de Broderie Personnalisée à Lyon",
    IMPRESSION_TEXTILE: "Service d'Impression par Transfert à Lyon",
    IMPRESSION_TRANSFERT: "Service d'Impression par Transfert à Lyon",
    FLOCAGE: "Flocage Textile Professionnel à Lyon",
    OBJETS_PUBLICITAIRES: "Objets Publicitaires Personnalisés à Lyon",
    HOME: "Lyon Marquage Service | Marquage Textile Professionnel",
    IMPRIMERIE: "Gammes de vêtements variées imprimé à Lyon ",
    ENSEIGNES: "Enseignes publicitaire et signalitique imprimé à Lyon",
  };

  return titles[type] || "Lyon Marquage Service";
}

function getServiceDescription(type: SectionType): string {
  const descriptions: Record<string, string> = {
    SERIGRAPHIE:
      "Service de sérigraphie textile de haute qualité pour professionnels à Lyon. Grand choix de supports, prix compétitifs et livraison rapide.",
    BRODERIE:
      "Broderie personnalisée pour vêtements professionnels à Lyon. Solutions B2B de qualité avec une finition impeccable.",
    IMPRESSION_TEXTILE:
      "Service d'impression par transfert et textile pour vêtements et objets à Lyon. Solution idéale pour les petites séries et visuels complexes. Service rapide et local pour entreprises et professionnels",
    IMPRESSION_TRANSFERT:
      "Service d'impression par transfert et textile pour vêtements et objets à Lyon. Solution idéale pour les petites séries et visuels complexes. Service rapide et local pour entreprises et professionnels",
    FLOCAGE:
      "Flocage textile professionnel à Lyon. Idéal pour les entreprises cherchant une finition veloutée de qualité avec une excellente tenue.",
    OBJETS_PUBLICITAIRES:
      "Personnalisation d'objets publicitaires pour entreprises à Lyon. Mugs, stylos, clés USB et plus avec votre logo.",
    HOME: "Entreprise lyonnaise spécialisée en marquage textile et objets publicitaires pour professionnels. Services locaux, prix compétitifs et livraison rapide.",
    IMPRIMERIE:
      "Impression sur différentes gammes de vêtements et produits variées pour différentes industires.",
    ENSEIGNES:
      "Impression sur des supports publicitaire destinés à la signalitique et aux vehicules. Solution adapté au B2B.",
  };

  return (
    descriptions[type] ||
    "Services de marquage textile et objets publicitaires professionnels à Lyon."
  );
}

function getServicePath(type: SectionType): string {
  const paths: Record<string, string> = {
    SERIGRAPHIE: "prestations/serigraphie",
    BRODERIE: "prestations/broderie",
    IMPRESSION_TEXTILE: "prestations/impression",
    IMPRESSION_TRANSFERT: "prestations/impression",
    FLOCAGE: "prestations/flocage",
    OBJETS_PUBLICITAIRES: "objets-publicitaires",
    HOME: "/",
    IMPRIMERIE: "/imprimerie",
    ENSEIGNES: "/enseignes",
  };

  return paths[type] || "";
}
