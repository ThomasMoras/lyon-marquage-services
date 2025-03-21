"use client";

import { PageSectionType } from "@/types";

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
  type?: PageSectionType;
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
function getServiceTitle(type: PageSectionType): string {
  const titles: Record<PageSectionType, string> = {
    serigraphie: "Service de Sérigraphie Professionnelle à Lyon",
    broderie: "Service de Broderie Personnalisée à Lyon",
    impression_textile: "Impression Textile de Qualité à Lyon",
    impression_transfert: "Service d'Impression par Transfert à Lyon",
    flocage: "Flocage Textile Professionnel à Lyon",
    objets_publicitaires: "Objets Publicitaires Personnalisés à Lyon",
    home: "Lyon Marquage Service | Marquage Textile Professionnel",
  };

  return titles[type] || "Lyon Marquage Service";
}

function getServiceDescription(type: PageSectionType): string {
  const descriptions: Record<PageSectionType, string> = {
    serigraphie:
      "Service de sérigraphie textile de haute qualité pour professionnels à Lyon. Grand choix de supports, prix compétitifs et livraison rapide.",
    broderie:
      "Broderie personnalisée pour vêtements professionnels à Lyon. Solutions B2B de qualité avec une finition impeccable.",
    impression_textile:
      "Impression textile directe sur tous types de vêtements à Lyon. Service rapide et local pour entreprises et professionnels.",
    impression_transfert:
      "Service d'impression par transfert pour textiles et objets à Lyon. Solution idéale pour les petites séries et visuels complexes.",
    flocage:
      "Flocage textile professionnel à Lyon. Idéal pour les entreprises cherchant une finition veloutée de qualité avec une excellente tenue.",
    objets_publicitaires:
      "Personnalisation d'objets publicitaires pour entreprises à Lyon. Mugs, stylos, clés USB et plus avec votre logo.",
    home: "Entreprise lyonnaise spécialisée en marquage textile et objets publicitaires pour professionnels. Services locaux, prix compétitifs et livraison rapide.",
  };

  return (
    descriptions[type] ||
    "Services de marquage textile et objets publicitaires professionnels à Lyon."
  );
}

function getServicePath(type: PageSectionType): string {
  const paths: Record<PageSectionType, string> = {
    serigraphie: "prestations/serigraphie",
    broderie: "prestations/broderie",
    impression_textile: "prestations/impression-textile",
    impression_transfert: "prestations/impression-transfert",
    flocage: "prestations/flocage",
    objets_publicitaires: "objets-publicitaires",
    home: "",
  };

  return paths[type] || "";
}
