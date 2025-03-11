// hooks/useTopTex.ts
import { useState, useCallback } from "react";
import { TopTexProduct, TopTexProductsResponse } from "@/types/toptex";

/**
 * Hook pour faciliter l'utilisation de l'API TopTex
 */
export function useTopTex() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Authentification auprès de l'API TopTex
   */
  const authenticate = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/top_tex/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Échec de l'authentification");
      }

      return data.token;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur s'est produite");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Récupération des produits par marque
   */
  const getProductsByBrand = useCallback(async (brand: string, usageRight?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = new URL("/api/top_tex/products/brand", window.location.origin);
      url.searchParams.append("brand", brand);
      if (usageRight) url.searchParams.append("usage_right", usageRight);

      const response = await fetch(url.toString());
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Échec de récupération des produits");
      }

      // Vérifier le format des données pour éviter l'erreur "products.map is not a function"
      if (Array.isArray(data.products)) {
        return data.products as TopTexProduct[];
      } else {
        console.warn("Format de réponse inattendu:", data);
        return [] as TopTexProduct[];
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur s'est produite");
      return [] as TopTexProduct[];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Récupération des produits par catégorie avec pagination
   */
  const getProductsByCategory = useCallback(
    async (params: {
      family: string;
      subfamily: string;
      usageRight?: string;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        const { family, subfamily, usageRight, pageNumber, pageSize } = params;

        const url = new URL("/api/top_tex/products/category", window.location.origin);
        url.searchParams.append("family", family);
        url.searchParams.append("subfamily", subfamily);
        if (usageRight) url.searchParams.append("usage_right", usageRight);
        if (pageNumber) url.searchParams.append("page_number", pageNumber.toString());
        if (pageSize) url.searchParams.append("page_size", pageSize.toString());

        const response = await fetch(url.toString());
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Échec de récupération des produits par catégorie");
        }

        // Extraire les produits et les informations de pagination
        let formattedResponse: TopTexProductsResponse;

        if (data.items && Array.isArray(data.items)) {
          formattedResponse = {
            items: data.items,
            total: data.total || data.items.length,
            page: data.page || params.pageNumber || 1,
            pageSize: data.pageSize || params.pageSize || 10,
            totalPages:
              data.totalPages ||
              Math.ceil(
                (data.total || data.items.length) / (data.pageSize || params.pageSize || 10)
              ),
          };
        } else {
          console.warn("Format de réponse inattendu:", data);
          // Fallback pour éviter les erreurs
          formattedResponse = {
            items: [],
            total: 0,
            page: params.pageNumber || 1,
            pageSize: params.pageSize || 10,
            totalPages: 0,
          };
        }

        return formattedResponse;
      } catch (err) {
        console.error("Erreur lors de la récupération des produits:", err);
        setError(err instanceof Error ? err.message : "Une erreur s'est produite");

        // Retourner une structure valide même en cas d'erreur
        return {
          items: [],
          total: 0,
          page: params.pageNumber || 1,
          pageSize: params.pageSize || 10,
          totalPages: 0,
        } as TopTexProductsResponse;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    error,
    authenticate,
    getProductsByBrand,
    getProductsByCategory,
  };
}
