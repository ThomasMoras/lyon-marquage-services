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

interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  type: PageSectionsPrisma;
}

type CatalogueItem = {
  category: string;
  items: MenuItem[];
};
