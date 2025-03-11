// app/api/top_tex/client.ts

import {
  TopTexAuthResponse,
  TopTexAuthRequest,
  TopTexProduct,
  TopTexProductsResponse,
  TopTexError,
} from "@/types/toptex";

class TopTexClient {
  private apiKey: string;
  private baseUrl: string;
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    this.apiKey = process.env.TOP_TEX_API_KEY || "";
    this.baseUrl = process.env.TOP_TEX_URL || "https://api.toptex.io";

    if (!this.apiKey) {
      throw new Error("TOP_TEX_API_KEY est manquant dans les variables d'environnement");
    }
  }

  private getHeaders(withAuth = true): HeadersInit {
    const headers: HeadersInit = {
      "x-api-key": this.apiKey,
      "Content-Type": "application/json",
    };

    if (withAuth && this.token) {
      headers["x-toptex-authorization"] = this.token;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData: TopTexError = await response.json();
      throw new Error(`TopTex API error: ${errorData.message || response.statusText}`);
    }

    // Certains endpoints peuvent renvoyer un fichier ou un contenu vide
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as T;
    }

    return {} as T;
  }

  async authenticate(username: string, password: string, forceRefresh = false): Promise<string> {
    try {
      // Si nous avons déjà un token valide et que forceRefresh n'est pas activé, on le réutilise
      if (!forceRefresh && this.token && this.tokenExpiry && this.tokenExpiry > new Date()) {
        console.log(
          "Utilisation du token existant (valide jusqu'à",
          this.tokenExpiry.toISOString(),
          ")"
        );
        return this.token;
      }

      // Vérification des paramètres
      if (!username || !password) {
        throw new Error(
          "Le nom d'utilisateur et le mot de passe sont requis pour l'authentification"
        );
      }

      console.log("Obtention d'un nouveau token d'authentification...");

      const response = await fetch(`${this.baseUrl}/v3/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur d'authentification:", response.status, errorText);
        throw new Error(`Échec d'authentification: ${response.status} ${response.statusText}`);
      }

      // Récupération et vérification du token
      const data = await response.json();

      if (!data || !data.token || typeof data.token !== "string") {
        console.error("Réponse d'authentification invalide:", data);
        throw new Error("La réponse ne contient pas de token valide");
      }

      // Stockage du token et de sa date d'expiration
      this.token = data.token;
      this.tokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 heure
      console.log("Nouveau token obtenu, valide jusqu'à", this.tokenExpiry.toISOString());

      return this.token || "";
    } catch (error) {
      console.error("Erreur lors de l'authentification:", error);
      // Réinitialisation du token en cas d'erreur
      this.token = null;
      this.tokenExpiry = null;
      throw error;
    }
  }

  // Méthode helper pour s'assurer d'avoir un token valide
  private async ensureAuthenticated(): Promise<string> {
    try {
      const username = process.env.TOP_TEX_USERNAME;
      const password = process.env.TOP_TEX_PASSWORD;

      if (!username || !password) {
        throw new Error("Credentials manquants: TOP_TEX_USERNAME ou TOP_TEX_PASSWORD");
      }

      // Si nous n'avons pas de token ou qu'il a expiré, on en demande un nouveau
      if (!this.token || !this.tokenExpiry || this.tokenExpiry <= new Date()) {
        console.log("Token manquant ou expiré, authentification requise");
        return await this.authenticate(username, password, true);
      }

      // Sinon on retourne le token existant
      return this.token;
    } catch (error) {
      console.error("Erreur dans ensureAuthenticated:", error);
      throw error;
    }
  }

  // Fonction à ajouter/remplacer dans votre client TopTex

  // Helper pour extraire les images et autres informations importantes
  // Fonction à ajouter/remplacer dans votre client TopTex

  private processProductData(product: any): TopTexProduct {
    // Si le produit est vide ou null, renvoyer un objet vide
    if (!product) {
      console.warn("Tentative de traitement d'un produit vide ou null");
      return {} as TopTexProduct;
    }

    console.log("Traitement du produit avec catalogReference:", product.catalogReference);

    // Extraction du SKU
    let sku = "";
    let colorCode = "";
    let sizeCode = "";
    let colorInfo: any[] = [];
    let sizeInfo: any[] = [];

    // Vérifier si le produit a des couleurs avec des tailles qui contiennent le SKU
    if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
      // Extraire les informations de couleur
      colorInfo = product.colors.map((color: any) => {
        const colorName =
          typeof color.colors === "object"
            ? color.colors.fr || color.colors.en || ""
            : color.colors || "";
        const hexaCode =
          Array.isArray(color.colorsHexa) && color.colorsHexa.length > 0 ? color.colorsHexa[0] : "";

        return {
          code: color.colorCode || "",
          name: colorName,
          hexaCode: hexaCode,
        };
      });

      // Prendre la première couleur pour extraire le SKU
      const firstColor = product.colors[0];
      colorCode = firstColor.colorCode || "";

      // Vérifier si cette couleur a des tailles
      if (firstColor.sizes && Array.isArray(firstColor.sizes) && firstColor.sizes.length > 0) {
        // Extraire les informations de taille
        sizeInfo = firstColor.sizes.map((size: any) => ({
          code: size.sizeCode || "",
          name: size.size || "",
          sku: size.sku || "",
        }));

        // Prendre la première taille pour le SKU
        const firstSize = firstColor.sizes[0];
        sizeCode = firstSize.sizeCode || "";
        sku = firstSize.sku || "";
      }
    }

    // Si nous n'avons pas trouvé de SKU, construisons-en un
    if (!sku && product.catalogReference) {
      // Si nous avons une référence catalogue et des codes couleur/taille, construire un SKU
      sku = product.catalogReference;
      if (colorCode) {
        sku += `_${colorCode}`;
        if (sizeCode) {
          sku += `_${sizeCode}`;
        }
      }
    }

    // Traitement des images
    let images = [];

    // Essayer d'extraire les images du produit
    if (product.images && Array.isArray(product.images)) {
      images = product.images.map((img: any) => img.url || img);
    }

    // Si nous avons des couleurs avec packshots, ajoutons-les aux images
    if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
      const firstColor = product.colors[0];
      if (firstColor.packshots) {
        const packshots = Object.values(firstColor.packshots);
        const packshotUrls = packshots.filter((ps: any) => ps && ps.url).map((ps: any) => ps.url);

        if (packshotUrls.length > 0) {
          images = [...images, ...packshotUrls];
        }
      }
    }

    // Prix public
    let publicPrice = null;
    if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
      const firstColor = product.colors[0];
      if (firstColor.sizes && Array.isArray(firstColor.sizes) && firstColor.sizes.length > 0) {
        const firstSize = firstColor.sizes[0];
        publicPrice = firstSize.publicUnitPrice || null;
        if (typeof publicPrice === "string") {
          // Convertir "14,96 €" en nombre 14.96
          publicPrice = parseFloat(publicPrice.replace(/[^\d,]/g, "").replace(",", "."));
        }
      }
    }

    // Traitement de la désignation
    let designation = product.designation;
    if (typeof designation === "object") {
      designation = designation.fr || designation.en || "Produit sans titre";
    } else if (!designation) {
      designation = "Produit sans titre";
    }

    // Description
    let description = product.description;
    if (typeof description === "object") {
      description = description.fr || description.en || "";
    }

    // Famille et sous-famille
    let family = product.family;
    if (typeof family === "object") {
      family = family.fr || family.en || "";
    }

    let subfamily = product.sub_family;
    if (typeof subfamily === "object") {
      subfamily = subfamily.fr || subfamily.en || "";
    }

    // Composition
    let composition = product.composition;
    if (typeof composition === "object") {
      composition = composition.fr || composition.en || "";
    }

    return {
      sku: sku || `${product.catalogReference}_default`,
      catalogReference: product.catalogReference || "",
      designation: designation,
      description: description,
      colorCode: colorCode,
      sizeCode: sizeCode,
      color: colorInfo.length > 0 ? colorInfo[0].name : "",
      size: sizeInfo.length > 0 ? sizeInfo[0].name : "",
      brand: product.brand || "",
      family: family,
      subfamily: subfamily,
      packaging: product.packaging || 0,
      publicPrice: publicPrice,
      price: publicPrice,
      // Tableau vide par défaut
      prices: [],
      images: images,
      colors: colorInfo,
      sizes: sizeInfo,
      mainImage: images && images.length > 0 ? images[0] : "/images/product-placeholder.jpg",
      // Autres propriétés
      composition: composition,
      weight: product.averageWeight || product.weight || "",
      labelType: product.labelType || "",
      // Conserver l'objet original pour le débogage
      _original: product,
    };
  }

  async getProductsByBrand(
    brand: string,
    usageRight: string = "b2b_uniquement"
  ): Promise<TopTexProduct[]> {
    if (!this.token) {
      throw new Error("Vous devez être authentifié pour accéder à cette ressource");
    }

    const url = new URL(`${this.baseUrl}/v3/products/all`);
    url.searchParams.append("brand", brand);
    url.searchParams.append("usage_right", usageRight);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.getHeaders(),
    });

    const data = await this.handleResponse<any>(response);
    let products = [];

    // Vérifier si la réponse est un tableau ou un objet avec une propriété items
    if (Array.isArray(data)) {
      products = data;
    } else if (data && Array.isArray(data.items)) {
      products = data.items;
    } else if (data) {
      // Parcourir les propriétés numériques qui pourraient contenir des produits
      for (const key in data) {
        if (!isNaN(Number(key)) && typeof data[key] === "object") {
          products.push(data[key]);
        }
      }
    } else {
      console.warn("Format de réponse inattendu:", data);
      products = [];
    }

    // Traiter chaque produit pour extraire les informations importantes
    return products.map((product) => this.processProductData(product));
  }

  async getProductsByCategory(params: {
    family: string;
    subfamily: string;
    usageRight?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<TopTexProductsResponse> {
    try {
      // S'assurer d'avoir un token valide
      await this.ensureAuthenticated();

      const { family, subfamily, usageRight = "b2b_b2c", pageNumber = 1, pageSize = 10 } = params;

      // Construire l'URL de l'API
      const url = new URL(`${this.baseUrl}/v3/products/all`);
      url.searchParams.append("family", family);
      url.searchParams.append("subfamily", subfamily);
      url.searchParams.append("usage_right", usageRight);
      url.searchParams.append("page_number", pageNumber.toString());
      url.searchParams.append("page_size", pageSize.toString());

      console.log(`Récupération des produits avec l'URL: ${url.toString()}`);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erreur API (${response.status}):`, errorText);
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      console.log("Réponse API reçue");

      // Déterminer le format des données reçues
      let products = [];
      let totalCount = 0;
      let totalPages = 0;

      if (Array.isArray(data)) {
        // Cas 1: La réponse est un tableau de produits
        console.log("Format de réponse: tableau de produits");
        products = data;
        totalCount = data.length;
        totalPages = Math.ceil(totalCount / pageSize);
      } else if (data && typeof data === "object") {
        // Cas 2: La réponse est un objet qui peut contenir une liste numérique de produits
        // Vérifier s'il y a des clés numériques (comme 0, 1, 2...)
        const numericKeys = Object.keys(data).filter((key) => !isNaN(Number(key)));

        if (numericKeys.length > 0) {
          console.log("Format de réponse: objet avec clés numériques");
          // Extraire les produits des clés numériques
          numericKeys.forEach((key) => {
            if (data[key] && typeof data[key] === "object") {
              products.push(data[key]);
            }
          });

          // Récupérer les informations de pagination si disponibles
          totalCount = data.total_count ? parseInt(data.total_count) : products.length;
          totalPages = data.total_pages
            ? parseInt(data.total_pages)
            : Math.ceil(totalCount / pageSize);
        } else if (data.items && Array.isArray(data.items)) {
          // Cas 3: La réponse est un objet avec une propriété "items"
          console.log("Format de réponse: objet avec propriété items");
          products = data.items;
          totalCount = data.total_count ? parseInt(data.total_count) : products.length;
          totalPages = data.total_pages
            ? parseInt(data.total_pages)
            : Math.ceil(totalCount / pageSize);
        } else {
          // Cas 4: Format inattendu
          console.warn("Format de réponse inattendu:", Object.keys(data));

          // Si c'est un objet unique de produit (sans pagination), le traiter comme tel
          if (data.catalogReference) {
            console.log("Format de réponse: produit unique");
            products = [data];
            totalCount = 1;
            totalPages = 1;
          }
        }
      }

      console.log(`Nombre de produits trouvés: ${products.length}`);

      // Maintenant, traiter chaque produit pour normaliser sa structure
      const processedProducts = products.map((product) => this.processProductData(product));

      console.log(`Produits traités: ${processedProducts.length}`);
      if (processedProducts.length > 0) {
        console.log("Premier produit traité:", {
          sku: processedProducts[0].sku,
          catalogReference: processedProducts[0].catalogReference,
          designation: processedProducts[0].designation,
        });
      }

      return {
        items: processedProducts,
        total: totalCount,
        page: pageNumber,
        pageSize: pageSize,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des produits par catégorie:", error);

      // Retourner une structure valide même en cas d'erreur
      return {
        items: [],
        total: 0,
        page: params.pageNumber || 1,
        pageSize: params.pageSize || 10,
        totalPages: 0,
      };
    }
  }
  // Ajoutez cette méthode à votre classe TopTexClient dans app/api/top_tex/client.ts

  // Méthode getProductDetails améliorée pour gérer les SKUs incomplets

  async getProductDetails(sku: string): Promise<TopTexProduct | null> {
    try {
      // Utiliser ensureAuthenticated pour garantir un token valide
      const token = await this.ensureAuthenticated();

      // Valeur par défaut pour usage_right
      const usageRight = "b2b_uniquement"; // ou 'b2b_b2c' selon vos besoins

      // Détecter si le SKU est complet (avec underscores) ou juste une référence catalogue
      const hasUnderscores = sku.includes("_");
      const catalogReference = hasUnderscores ? sku.split("_")[0] : sku;

      console.log(`Traitement du SKU: ${sku}`);
      console.log(`Format détecté: ${hasUnderscores ? "SKU complet" : "Référence catalogue"}`);
      console.log(`Référence catalogue extraite: ${catalogReference}`);

      // Si c'est un SKU complet, essayer d'abord la recherche directe
      if (hasUnderscores) {
        try {
          const url = new URL(`${this.baseUrl}/v3/products`);
          url.searchParams.append("sku", sku);
          url.searchParams.append("usage_right", usageRight);

          console.log(`Tentative de récupération par SKU complet:`, url.toString());

          const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
              "x-api-key": this.apiKey,
              "x-toptex-authorization": token,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
              return this.processProductData(data[0]);
            } else if (data && typeof data === "object" && !Array.isArray(data)) {
              return this.processProductData(data);
            } else {
              console.log(
                "Pas de résultat avec le SKU complet, passage à la recherche par référence catalogue"
              );
            }
          } else {
            console.log(
              `Recherche par SKU complet a échoué (${response.status}), passage à la recherche par référence catalogue`
            );
          }
        } catch (error) {
          console.error("Erreur lors de la recherche par SKU complet:", error);
        }
      }

      // Recherche par référence catalogue
      try {
        const url = new URL(`${this.baseUrl}/v3/products`);
        url.searchParams.append("usage_right", usageRight);
        url.searchParams.append("catalog_reference", catalogReference);

        console.log(`Tentative de récupération par référence catalogue:`, url.toString());

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "x-api-key": this.apiKey,
            "x-toptex-authorization": token,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Erreur API (${response.status}):`, errorText);
          return null;
        }

        const data = await response.json();
        let products = [];

        if (Array.isArray(data) && data.length > 0) {
          products = data;
          console.log(
            `Trouvé ${products.length} produit(s) avec la référence catalogue ${catalogReference}`
          );
        } else if (data && Array.isArray(data.items)) {
          products = data.items;
          console.log(
            `Trouvé ${products.length} produit(s) (format items) avec la référence catalogue ${catalogReference}`
          );
        } else if (data) {
          // Parcourir les propriétés numériques qui pourraient contenir des produits
          for (const key in data) {
            if (!isNaN(Number(key)) && typeof data[key] === "object") {
              products.push(data[key]);
            }
          }
          console.log(
            `Trouvé ${products.length} produit(s) (format indexé) avec la référence catalogue ${catalogReference}`
          );
        } else {
          console.log(`Aucun produit trouvé avec la référence catalogue ${catalogReference}`);
        }

        // Si SKU complet, essayer de trouver une correspondance exacte
        if (hasUnderscores && products.length > 0) {
          const exactMatch = products.find((p: any) => p.sku === sku);
          if (exactMatch) {
            console.log(`Correspondance exacte trouvée pour le SKU ${sku}`);
            return this.processProductData(exactMatch);
          }
        }

        // Si pas de correspondance exacte mais qu'on a au moins un produit, prendre le premier
        if (products.length > 0) {
          console.log(
            `Utilisation du premier produit disponible pour ${catalogReference} (${
              products[0].sku || "sans SKU"
            })`
          );
          return this.processProductData(products[0]);
        }
      } catch (error) {
        console.error("Erreur lors de la recherche par référence catalogue:", error);
      }

      // Si toutes les tentatives échouent
      console.warn(`Aucun produit trouvé pour la référence: ${sku}`);
      return null;
    } catch (error) {
      console.error("Erreur globale dans getProductDetails:", error);
      throw error;
    }
  }
  // Ajoutez d'autres méthodes selon vos besoins
  /**
   * Récupère un produit par sa référence catalogue
   * @param catalogReference La référence catalogue du produit à récupérer
   * @param options Options supplémentaires (usage_right, langues, etc.)
   * @returns Le produit trouvé ou null si aucun produit n'est trouvé
   */
  async getProductByCatalogReference(
    catalogReference: string,
    options: {
      usageRight?: string;
      lang?: string[];
      color?: string;
    } = {}
  ): Promise<TopTexProduct | null> {
    try {
      // S'assurer d'avoir un token valide
      await this.ensureAuthenticated();

      // Paramètres par défaut
      const usageRight = options.usageRight || "b2b_uniquement";

      // Construire l'URL de l'API
      const url = new URL(`${this.baseUrl}/v3/products`);
      url.searchParams.append("catalog_reference", catalogReference);
      url.searchParams.append("usage_right", usageRight);

      // Ajouter les langues si spécifiées
      if (options.lang && options.lang.length > 0) {
        url.searchParams.append("lang", options.lang.join(","));
      }

      // Ajouter le code couleur si spécifié
      if (options.color) {
        url.searchParams.append("color", options.color);
      }

      console.log(
        `Récupération du produit avec la référence catalogue ${catalogReference} via l'URL: ${url.toString()}`
      );

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erreur API (${response.status}):`, errorText);
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Réponse API reçue pour la référence catalogue ${catalogReference}`);

      // Déterminer le format des données reçues
      let products = [];

      if (Array.isArray(data)) {
        // Cas 1: La réponse est un tableau de produits
        console.log(`Format de réponse: tableau de produits (${data.length})`);
        products = data;
      } else if (data && typeof data === "object") {
        // Cas 2: La réponse est un objet qui peut contenir une liste numérique de produits
        const numericKeys = Object.keys(data).filter((key) => !isNaN(Number(key)));

        if (numericKeys.length > 0) {
          console.log(`Format de réponse: objet avec clés numériques (${numericKeys.length})`);
          numericKeys.forEach((key) => {
            if (data[key] && typeof data[key] === "object") {
              products.push(data[key]);
            }
          });
        } else if (data.items && Array.isArray(data.items)) {
          // Cas 3: La réponse est un objet avec une propriété "items"
          console.log(`Format de réponse: objet avec propriété items (${data.items.length})`);
          products = data.items;
        } else if (data.catalogReference === catalogReference) {
          // Cas 4: La réponse est directement un objet produit
          console.log("Format de réponse: produit unique");
          products = [data];
        } else {
          console.warn("Format de réponse inattendu:", Object.keys(data));
        }
      }

      console.log(
        `Nombre de produits trouvés pour la référence ${catalogReference}: ${products.length}`
      );

      // Si aucun produit n'est trouvé, retourner null
      if (products.length === 0) {
        return null;
      }

      // Traiter le premier produit trouvé
      const processedProduct = this.processProductData(products[0]);

      console.log("Produit traité:", {
        sku: processedProduct.sku,
        catalogReference: processedProduct.catalogReference,
        designation: processedProduct.designation,
        colors: processedProduct.colors?.length || 0,
        sizes: processedProduct.sizes?.length || 0,
        images: processedProduct.images?.length || 0,
      });

      return processedProduct;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération du produit avec la référence ${catalogReference}:`,
        error
      );
      return null;
    }
  }
}

// Singleton pour réutiliser la même instance
let topTexClientInstance: TopTexClient | null = null;

export function getTopTexClient(): TopTexClient {
  if (!topTexClientInstance) {
    topTexClientInstance = new TopTexClient();
  }
  return topTexClientInstance;
}
