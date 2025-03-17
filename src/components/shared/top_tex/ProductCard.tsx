"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCardProps } from "@/types/toptex";

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Fallback pour le SKU si non disponible
  const productSku = product.sku || `${product.catalogReference || "unknown"}_variant`;

  // Récupérer l'URL de l'image ou utiliser un placeholder
  const imageUrl =
    product.mainImage ||
    (product.images && product.images.length > 0
      ? typeof product.images[0] === "string"
        ? product.images[0]
        : product.images[0].url
      : "/images/product-placeholder.jpg");

  // Récupérer la désignation du produit
  const productName =
    typeof product.designation === "object"
      ? product.designation.fr || product.designation.en || "Produit sans titre"
      : product.designation || "Produit sans titre";

  // Récupérer le prix du produit
  const price = product.price || product.publicPrice || null;

  // Construire l'URL du produit - utiliser catalogReference si pas de SKU
  const productUrl = `/produits/${productSku}`;

  // Couleurs disponibles
  const colors = Array.isArray(product.colors) ? product.colors : [];

  // Afficher max 6 couleurs, avec un indicateur pour les autres
  const displayedColors = colors.slice(0, 6);
  const hasMoreColors = colors.length > 6;

  return (
    <Link href={productUrl}>
      <Card
        className="overflow-hidden transition-all duration-300 hover:shadow-lg border-0 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Container d'image avec ratio 3:4 */}
        <div className="relative pt-[133%] bg-gray-100 overflow-hidden">
          {/* Badge en haut à droite */}
          {product.brand && (
            <Badge className="absolute top-2 right-2 z-10 bg-white text-black">
              {product.brand}
            </Badge>
          )}

          {/* Image du produit */}
          <Image
            src={imageUrl}
            alt={productName}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? "scale-105" : ""
            }`}
            width={300}
            height={400}
            priority={false}
          />

          {/* Overlay d'informations qui apparaît au hover */}
          <div
            className={`absolute inset-0 bg-black/5 flex items-end transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="p-3 w-full bg-white/80 backdrop-blur-sm">
              <p className="text-sm font-medium">Voir le produit</p>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Nom du produit */}
          <h3 className="font-medium text-base mb-1 line-clamp-2">{productName}</h3>

          {/* Référence (sous le nom) */}
          <p className="text-xs text-gray-500 mb-2">
            Réf: {product.catalogReference || productSku}
          </p>

          {/* Prix du produit */}
          {price !== null && (
            <p className="text-lg font-bold mb-3">
              {typeof price === "number" ? `${price.toFixed(2)} €` : price}
            </p>
          )}

          {/* Affichage des couleurs disponibles */}
          {colors.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {displayedColors.map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{
                      backgroundColor: color.hexaCode || "#ccc",
                    }}
                    title={color.name || `Couleur ${index + 1}`}
                  />
                ))}
                {hasMoreColors && (
                  <div className="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center text-[9px] bg-gray-100">
                    +{colors.length - 6}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
