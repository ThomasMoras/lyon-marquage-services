export type PageSectionType =
  | "home"
  | "serigraphie"
  | "broderie"
  | "impression_textile"
  | "impression_transfert"
  | "flocage";

export type MenuItem = {
  title: string;
  href: string;
  description?: string;
};

export interface PageSectionProps {
  pageSection: PageSectionType;
}

export type CatalogueItem = {
  category: string;
  items: MenuItem[];
};
