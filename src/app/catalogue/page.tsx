import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { menuCatalogue } from "@/constants/catalogue";

export const metadata = {
  title: "Catalogue de produits | Lyon Marquage Service",
  description:
    "Découvrez notre sélection complète de vêtements et accessoires personnalisables pour votre communication.",
};

export default function CataloguePage() {
  // Filtrer les produits pour éliminer les doublons
  const products = menuCatalogue[0].items;
  const uniqueProducts = products.filter(
    (item, index, self) => index === self.findIndex((i) => i.title === item.title)
  );

  // Marques
  const brands = menuCatalogue[1].items;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">Catalogue complet</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Découvrez notre sélection complète de vêtements et accessoires personnalisables de haute
          qualité. Tous nos produits sont adaptés à une personnalisation professionnelle pour mettre
          en valeur votre marque.
        </p>

        {/* Banner */}
        <div className="relative h-64 w-full rounded-lg overflow-hidden mb-10">
          <Image
            src="/api/placeholder/1200/400"
            alt="Catalogue Lyon Marquage Service"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white p-6">
            <h2 className="text-3xl font-bold mb-2 text-center">
              Trouvez le produit idéal pour votre communication
            </h2>
            <p className="text-lg text-center max-w-2xl">
              Large choix de vêtements et accessoires pour tous vos besoins promotionnels
            </p>
          </div>
        </div>
      </div>

      {/* Produits populaires */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Nos produits populaires</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {uniqueProducts.slice(0, 8).map((item, index) => (
            <Link href={item.href} key={`${item.title}-${index}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative h-48 w-full mb-4">
                    <Image
                      src="/api/placeholder/300/200"
                      alt={item.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <h3 className="font-medium text-center">{item.title}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Lien vers tous les produits */}
        {uniqueProducts.length > 8 && (
          <div className="flex justify-center mt-8">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors">
              Voir tous les produits ({uniqueProducts.length})
            </button>
          </div>
        )}
      </div>

      {/* Catégories */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Catégories de produits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* T-shirts et polos */}
          <Link href="/catalogue/tshirt">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="relative h-40 w-full mb-4">
                  <Image
                    src="/api/placeholder/300/200"
                    alt="T-shirts et polos"
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <h3 className="font-medium text-center">T-shirts & Polos</h3>
                <p className="text-sm text-gray-500 text-center">
                  Les essentiels pour votre communication
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Vestes et sweatshirts */}
          <Link href="/catalogue/sweat">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="relative h-40 w-full mb-4">
                  <Image
                    src="/api/placeholder/300/200"
                    alt="Vestes et sweatshirts"
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <h3 className="font-medium text-center">Vestes & Sweatshirts</h3>
                <p className="text-sm text-gray-500 text-center">
                  Confort et style pour vos équipes
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Casquettes et accessoires */}
          <Link href="/catalogue/casquette">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="relative h-40 w-full mb-4">
                  <Image
                    src="/api/placeholder/300/200"
                    alt="Casquettes et accessoires"
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <h3 className="font-medium text-center">Casquettes & Accessoires</h3>
                <p className="text-sm text-gray-500 text-center">
                  Complétez votre communication visuelle
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Marques */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Nos marques partenaires</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mb-8">
          {brands.map((brand) => (
            <Link href={brand.href} key={brand.title}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-4 flex items-center justify-center h-32">
                  <div className="relative h-16 w-full">
                    <Image
                      src="/api/placeholder/150/75"
                      alt={brand.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Banner personnalisation */}
      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mt-12">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Service de personnalisation</h2>
            <p className="mb-4">
              Tous nos produits peuvent être personnalisés selon vos besoins. Nous proposons
              différentes techniques de marquage adaptées à chaque support. Contactez-nous pour un
              devis personnalisé ou des échantillons.
            </p>
            <div className="flex gap-3">
              <a
                href="/contact"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Demander un devis
              </a>
              <a
                href="/services"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors"
              >
                Nos services
              </a>
            </div>
          </div>
          <div className="relative h-40 w-full md:w-72 rounded-lg overflow-hidden">
            <Image
              src="/api/placeholder/300/200"
              alt="Personnalisation textile"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
