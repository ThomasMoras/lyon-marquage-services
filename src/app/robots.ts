import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/login",
          "/prestations/impression-textile",
          "/flocage/sport",
          "/flocage",
          "/presentation",
          "/broderie",
        ],
      },
    ],
    sitemap: "https://www.lyonmarquage.fr/sitemap.xml",
  };
}
