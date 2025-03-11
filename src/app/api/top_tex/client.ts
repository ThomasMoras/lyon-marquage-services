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

  async authenticate(username: string, password: string): Promise<string> {
    // Si le token existe et est valide, on le retourne directement
    if (this.token && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.token;
    }

    const response = await fetch(`${this.baseUrl}/v3/authenticate`, {
      method: "POST",
      headers: this.getHeaders(false),
      body: JSON.stringify({ username, password }),
    });

    const data = await this.handleResponse<TopTexAuthResponse>(response);
    this.token = data.token;

    // On suppose que le token est valide pour 24h (à ajuster selon la documentation)
    this.tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return this.token;
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
    // Vérifier si la réponse est un tableau ou un objet avec une propriété items
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.items)) {
      return data.items;
    } else {
      console.warn("Format de réponse inattendu:", data);
      return [];
    }
  }

  async getProductsByCategory(params: {
    family: string;
    subfamily: string;
    usageRight?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<TopTexProductsResponse> {
    if (!this.token) {
      throw new Error("Vous devez être authentifié pour accéder à cette ressource");
    }

    const { family, subfamily, usageRight = "b2b_b2c", pageNumber = 1, pageSize = 10 } = params;

    const url = new URL(`${this.baseUrl}/v3/products/all`);
    url.searchParams.append("family", family);
    url.searchParams.append("subfamily", subfamily);
    url.searchParams.append("usage_right", usageRight);
    url.searchParams.append("page_number", pageNumber.toString());
    url.searchParams.append("page_size", pageSize.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.getHeaders(),
    });

    const data = await this.handleResponse<any>(response);
    console.log("Données reçues de l'API:", data);

    // Construction d'une réponse adaptée selon le format reçu
    if (Array.isArray(data)) {
      // Si les données sont un tableau simple de produits
      return {
        items: data,
        total: data.length,
        page: pageNumber,
        pageSize: pageSize,
        totalPages: Math.ceil(data.length / pageSize),
      };
    } else if (data && Array.isArray(data.items)) {
      // Si les données sont déjà au format attendu avec items
      return {
        items: data.items,
        total: data.total_count || data.items.length,
        page: data.page_number ? parseInt(data.page_number) : pageNumber,
        pageSize: data.page_size ? parseInt(data.page_size) : pageSize,
        totalPages: data.total_count
          ? Math.ceil(data.total_count / (data.page_size ? parseInt(data.page_size) : pageSize))
          : 1,
      };
    } else if (data) {
      // Si c'est un objet mais pas au format attendu (comme vu dans les logs)
      // On examine les propriétés pour trouver les produits
      const items = [];
      const totalCount = data.total_count ? parseInt(data.total_count) : 0;

      // Parcourir les propriétés numériques qui pourraient contenir des produits
      for (const key in data) {
        if (!isNaN(Number(key)) && typeof data[key] === "object") {
          items.push(data[key]);
        }
      }

      return {
        items,
        total: totalCount || items.length,
        page: data.page_number ? parseInt(data.page_number) : pageNumber,
        pageSize: data.page_size ? parseInt(data.page_size) : pageSize,
        totalPages: totalCount
          ? Math.ceil(totalCount / (data.page_size ? parseInt(data.page_size) : pageSize))
          : 1,
      };
    }

    // Fallback pour éviter l'erreur
    return {
      items: [],
      total: 0,
      page: pageNumber,
      pageSize: pageSize,
      totalPages: 0,
    };
  }

  // Ajoutez d'autres méthodes selon vos besoins
}

// Singleton pour réutiliser la même instance
let topTexClientInstance: TopTexClient | null = null;

export function getTopTexClient(): TopTexClient {
  if (!topTexClientInstance) {
    topTexClientInstance = new TopTexClient();
  }
  return topTexClientInstance;
}
