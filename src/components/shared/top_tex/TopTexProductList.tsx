// components/shared/top_tex/TopTexProductList.tsx
"use client";

import { useState, useEffect } from "react";
import { useTopTex } from "@/hooks/useTopTex";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface TopTexProductListProps {
  family: string;
  subfamily: string;
  initialPage?: number;
  pageSize?: number;
}

export default function TopTexProductList({
  family,
  subfamily,
  initialPage = 1,
  pageSize = 10,
}: TopTexProductListProps) {
  const { isLoading, error, getProductsByCategory } = useTopTex();
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 0,
    totalItems: 0,
  });

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
  }, [family, subfamily]); // Supprimer initialPage et pageSize des dépendances pour éviter les rechargements en boucle

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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Produits {subfamily} - {family}
        </h2>

        {isLoading && <div className="text-sm text-gray-500">Chargement...</div>}
      </div>

      {(!products || products.length === 0) && !isLoading ? (
        <div className="p-8 text-center bg-gray-50 rounded-lg">
          Aucun produit trouvé dans cette catégorie.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(products) &&
              products.map((product, index) => (
                <Card key={product.sku || index} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">
                      {product.designation?.fr || product.designation?.en || "Produit sans titre"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">SKU:</span> {product.sku || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Référence:</span>{" "}
                        {product.catalogReference || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Marque:</span> {product.brand || "N/A"}
                      </p>
                      {product.colors && product.colors.length > 0 ? (
                        <p>
                          <span className="font-medium">Couleurs disponibles:</span>{" "}
                          {product.colors.length}
                        </p>
                      ) : (
                        <p>
                          <span className="font-medium">Couleur:</span> {product.color || "N/A"}
                        </p>
                      )}
                      {product.publicPrice && (
                        <p className="text-lg font-bold mt-4">
                          Prix:{" "}
                          {typeof product.publicPrice === "number"
                            ? product.publicPrice.toFixed(2)
                            : product.publicPrice}{" "}
                          €
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Voir détails
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8">
            <div className="text-sm text-gray-600">
              Affichage de la page {pagination.currentPage} sur {pagination.totalPages}(
              {pagination.totalItems} produits au total)
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={pagination.currentPage === 1 || isLoading}
                onClick={handlePrevPage}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                disabled={pagination.currentPage === pagination.totalPages || isLoading}
                onClick={handleNextPage}
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
