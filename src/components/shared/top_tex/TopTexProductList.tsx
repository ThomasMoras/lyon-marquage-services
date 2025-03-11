// components/shared/top_tex/TopTexProductList.tsx
"use client";

import { useState, useEffect } from "react";
import { useTopTex } from "@/hooks/useTopTex";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "./ProductCard";

interface TopTexProductListProps {
  family: string;
  subfamily: string;
  initialPage?: number;
  pageSize?: number;
  title?: string;
}

export default function TopTexProductList({
  family,
  subfamily,
  initialPage = 1,
  pageSize = 12,
  title,
}: TopTexProductListProps) {
  const { isLoading, error, getProductsByCategory } = useTopTex();
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 0,
    totalItems: 0,
  });
  const [sortOption, setSortOption] = useState("default");

  const loadProducts = async (page: number) => {
    try {
      const result = await getProductsByCategory({
        family,
        subfamily,
        pageNumber: page,
        pageSize,
      });

      console.log("Résultat formaté:", result);

      // S'assurer que result.items est un tableau avant de l'assigner
      if (result && Array.isArray(result.items)) {
        setProducts(result.items);
        console.log("Premier produit:", result.items[0]);
      } else {
        console.error("Les données reçues ne sont pas au format attendu:", result);
        setProducts([]);
      }

      setPagination({
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
      });
    } catch (err) {
      console.error("Erreur lors du chargement des produits:", err);
      setProducts([]);
    }
  };

  // Utiliser useEffect seulement pour le chargement initial
  useEffect(() => {
    loadProducts(initialPage);
  }, [family, subfamily]);

  // Fonction pour trier les produits
  const sortProducts = (option: string) => {
    setSortOption(option);

    const sortedProducts = [...products];

    switch (option) {
      case "price-asc":
        sortedProducts.sort((a, b) => {
          const priceA = a.price || a.publicPrice || 0;
          const priceB = b.price || b.publicPrice || 0;
          return priceA - priceB;
        });
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => {
          const priceA = a.price || a.publicPrice || 0;
          const priceB = b.price || b.publicPrice || 0;
          return priceB - priceA;
        });
        break;
      case "name-asc":
        sortedProducts.sort((a, b) => {
          const nameA =
            typeof a.designation === "object"
              ? a.designation.fr || a.designation.en || ""
              : a.designation || "";
          const nameB =
            typeof b.designation === "object"
              ? b.designation.fr || b.designation.en || ""
              : b.designation || "";
          return nameA.localeCompare(nameB);
        });
        break;
      case "name-desc":
        sortedProducts.sort((a, b) => {
          const nameA =
            typeof a.designation === "object"
              ? a.designation.fr || a.designation.en || ""
              : a.designation || "";
          const nameB =
            typeof b.designation === "object"
              ? b.designation.fr || b.designation.en || ""
              : b.designation || "";
          return nameB.localeCompare(nameA);
        });
        break;
      default:
        // Ne rien faire, garder l'ordre par défaut
        break;
    }

    setProducts(sortedProducts);
  };

  // Gestion de la pagination
  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      loadProducts(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      loadProducts(pagination.currentPage + 1);
    }
  };

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-md">Erreur: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec titre et options de tri */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{title || `${subfamily} - ${family}`}</h1>
          <p className="text-gray-500 mt-1">{pagination.totalItems} produits trouvés</p>
        </div>

        <div className="flex items-center gap-4">
          {isLoading && <div className="text-sm text-gray-500">Chargement...</div>}

          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">Trier par:</span>
            <Select value={sortOption} onValueChange={sortProducts}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tri par défaut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Tri par défaut</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="name-asc">Nom (A-Z)</SelectItem>
                <SelectItem value="name-desc">Nom (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {(!products || products.length === 0) && !isLoading ? (
        <div className="p-8 text-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun produit trouvé dans cette catégorie.</p>
          <Button className="mt-4" variant="outline">
            Découvrir d&apos;autres produits
          </Button>
        </div>
      ) : (
        <>
          {/* Grille de produits */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.isArray(products) &&
              products.map((product, index) => (
                <ProductCard key={product.sku || `product-${index}`} product={product} />
              ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
            <div className="text-sm text-gray-600">
              Affichage de la page {pagination.currentPage} sur {pagination.totalPages}(
              {pagination.totalItems} produits au total)
            </div>
            <div className="flex gap-2">
              <Button
                variant={pagination.currentPage === 1 ? "outline" : "default"}
                disabled={pagination.currentPage === 1 || isLoading}
                onClick={handlePrevPage}
                className="min-w-[100px]"
              >
                Précédent
              </Button>
              <Button
                variant={pagination.currentPage === pagination.totalPages ? "outline" : "default"}
                disabled={pagination.currentPage === pagination.totalPages || isLoading}
                onClick={handleNextPage}
                className="min-w-[100px]"
              >
                Suivant
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
