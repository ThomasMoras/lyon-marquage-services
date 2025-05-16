import { SectionType } from "@prisma/client";

export type PageSectionType =
  | "home"
  | "serigraphie"
  | "broderie"
  | "impression"
  | "flocage"
  | "objets_publicitaires"
  | "imprimerie"
  | "enseignes";

export type MenuItem = {
  title: string;
  href: string;
  description?: string;
};

export interface PageSectionProps {
  pageSection: SectionType;
}

export type CatalogueItem = {
  category: string;
  items: MenuItem[];
};
