type MenuItem = {
  title: string;
  href: string;
  description?: string;
};

type CatalogueItem = {
  category: string;
  items: MenuItem[];
};
