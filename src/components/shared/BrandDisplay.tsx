import React from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ProductCategoryDisplay from "./ProductCategoryDisplay";

interface BrandDisplayProps {
  title: string;
  brandDescription?: string;
  aboutContent?: React.ReactNode;
  children?: React.ReactNode;
}

export default function BrandDisplay({ title, brandDescription, aboutContent }: BrandDisplayProps) {
  const defaultDescription = `${title} est une marque reconnue dans le secteur du textile promotionnel, offrant une 
  gamme complète de vêtements de qualité supérieure adaptés à la personnalisation.`;

  const defaultAboutContent = (
    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
      {title} est reconnue pour la qualité et le style de ses produits textiles. La marque propose
      une gamme variée de vêtements adaptés à la personnalisation, alliant confort, durabilité et
      esthétique.
    </p>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
        <div className="relative h-24 w-48">
          <Image
            src="/api/placeholder/200/100"
            alt={`Logo ${title}`}
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-lg mt-2 text-gray-600 dark:text-gray-300">
            {brandDescription || defaultDescription}
          </p>
        </div>
      </div>

      <Tabs defaultValue="products" className="mb-10">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="products" className="flex-1">
            Produits
          </TabsTrigger>
          <TabsTrigger value="about" className="flex-1">
            À propos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">À propos de {title}</h2>
              {aboutContent || defaultAboutContent}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <ProductCategoryDisplay title={`Catalogue ${title}`} family="Marques" subfamily={title} />
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Personnalisation sur mesure</h2>
        <p className="mb-4">
          Tous les produits {title} peuvent être personnalisés avec votre logo ou message. Nous
          proposons différentes techniques de marquage adaptées à chaque type de produit.
        </p>
        <div className="flex justify-center">
          <a
            href="/contact"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Demander un devis
          </a>
        </div>
      </div>
    </div>
  );
}
