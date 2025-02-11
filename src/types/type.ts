type MenuItem = {
  title: string;
  href: string;
  description?: string;
};

interface PageSections {
  pageSection:
    | "home"
    | "serigraphie"
    | "broderie"
    | "impression_textile"
    | "impression_transfert"
    | "flocage";
}

type CatalogueItem = {
  category: string;
  items: MenuItem[];
};
