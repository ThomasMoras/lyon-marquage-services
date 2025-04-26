import { MetadataRoute } from "next";
import prisma from "../lib/prisma";
import { SectionType } from "@prisma/client";

type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: ChangeFrequency;
  priority: number;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lyonmarquage.fr";

  const WEEKLY: ChangeFrequency = "weekly";
  const MONTHLY: ChangeFrequency = "monthly";

  // Pages principales avec leur date de dernière modification
  const mainPages: SitemapEntry[] = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: MONTHLY,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/objets-publicitaires`,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/imprimerie`,
      lastModified: new Date(),
      changeFrequency: MONTHLY,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/enseignes`,
      lastModified: new Date(),
      changeFrequency: MONTHLY,
      priority: 0.8,
    },
  ];

  // Pages de prestations
  const prestationsPages: SitemapEntry[] = [
    {
      url: `${baseUrl}/prestations/serigraphie`,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/prestations/broderie`,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/prestations/impression`,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/prestations/flocage`,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.9,
    },
  ];

  // Pages de services (pour les mots-clés - ces URLs seront redirigées)
  const servicePages: SitemapEntry[] = [
    // Mot-clé "sérigraphie"
    {
      url: `${baseUrl}/services/serigraphie`,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.8,
    },
    // Mot-clé "sérigraphie publicitaire"
    {
      url: `${baseUrl}/services/serigraphie-publicitaire`,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.8,
    },
    // Mot-clé "sérigraphie tee-shirt"
    {
      url: `${baseUrl}/services/serigraphie-tee-shirt`,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.8,
    },
    // Mot-clé "flocage textile"
    {
      url: `${baseUrl}/services/flocage-textile`,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.8,
    },
    // Mot-clé "kakemono"
    {
      url: `${baseUrl}/services/kakemono`,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.8,
    },
    // Mot-clé "marquage publicitaire"
    {
      url: `${baseUrl}/services/marquage-publicitaire`,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.8,
    },
    // Mot-clé "personnalisation de tee-shirt"
    {
      url: `${baseUrl}/services/personnalisation-tee-shirt`,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.8,
    },
    // Mot-clé "totem"
    {
      url: `${baseUrl}/services/totem`,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.8,
    },
    // Mot-clé "marquage de véhicule"
    {
      url: `${baseUrl}/services/marquage-vehicule`,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.8,
    },
    // Mot-clé "marquage industriel"
    {
      url: `${baseUrl}/services/marquage-industriel`,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.8,
    },
    // Mot-clé "lettrage adhésif"
    {
      url: `${baseUrl}/services/lettrage-adhesif`,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.8,
    },
    // Mot-clé "habillage de façade"
    {
      url: `${baseUrl}/services/vetement-personnalise`,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.8,
    },
    // Mot-clé "impression directe"
    {
      url: `${baseUrl}/services/impression-directe`,
      lastModified: new Date(),
      changeFrequency: WEEKLY,
      priority: 0.8,
    },
  ];

  // Essayer de récupérer les dates de dernière modification depuis la base de données
  try {
    const sections = await prisma.section.findMany({
      select: {
        type: true,
        updatedAt: true,
      },
    });

    // Créer un mapping entre les types de section et les URLs
    const typeToUrl: Record<SectionType, string> = {
      [SectionType.SERIGRAPHIE]: `/prestations/serigraphie`,
      [SectionType.BRODERIE]: `/prestations/broderie`,
      [SectionType.IMPRESSION]: `/prestations/impression`,
      [SectionType.FLOCAGE]: `/prestations/flocage`,
      [SectionType.OBJETS_PUBLICITAIRES]: `/objets-publicitaires`,
      [SectionType.HOME]: `/`,
      [SectionType.ENSEIGNES]: `/enseignes`,
      [SectionType.IMPRIMERIE]: `/imprimerie`,
    };

    // Mettre à jour les dates des pages correspondantes
    sections.forEach((section) => {
      const urlPath = typeToUrl[section.type as SectionType];
      if (urlPath) {
        const fullUrl = `${baseUrl}${urlPath}`;
        const pageIndex = [...mainPages, ...prestationsPages].findIndex(
          (page) => page.url === fullUrl
        );
        if (pageIndex !== -1) {
          if (pageIndex < mainPages.length) {
            mainPages[pageIndex].lastModified = section.updatedAt;
          } else {
            prestationsPages[pageIndex - mainPages.length].lastModified = section.updatedAt;
          }
        }
      }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des sections:", error);
  }

  // Combiner toutes les pages
  return [...mainPages, ...prestationsPages, ...servicePages];
}
