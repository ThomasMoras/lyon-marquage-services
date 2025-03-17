import { authenticate, ensureAuthenticated } from "./auth";
import { getHeaders, processProductData } from "./utils";
import {
  getProductsByBrand,
  getProductsByCategory,
  getProductDetails,
  getProductByCatalogReference,
} from "./products";
import {
  TopTexProduct,
  TopTexProductsResponse,
  ProductCategoryParams,
  ProductReferenceOptions,
  RawProductData,
} from "../types";

class TopTexClient {
  private apiKey: string;
  public baseUrl: string;
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    this.apiKey = process.env.TOP_TEX_API_KEY || "";
    this.baseUrl = process.env.TOP_TEX_URL || "https://api.toptex.io";

    if (!this.apiKey) {
      throw new Error("TOP_TEX_API_KEY est manquant dans les variables d'environnement");
    }
  }

  /**
   * Get headers for API requests
   */
  public getHeaders(withAuth = true): HeadersInit {
    return getHeaders(this.apiKey, this.token, withAuth);
  }

  /**
   * Authenticate with the TopTex API
   */
  async authenticate(username: string, password: string, forceRefresh = false): Promise<string> {
    try {
      const result = await authenticate(
        this.baseUrl,
        this.apiKey,
        username,
        password,
        this.token,
        this.tokenExpiry,
        forceRefresh
      );

      this.token = result.token;
      this.tokenExpiry = result.tokenExpiry;

      return this.token;
    } catch (error) {
      console.error("Error in client.authenticate:", error);
      this.token = null;
      this.tokenExpiry = null;
      throw error;
    }
  }

  /**
   * Ensure we have a valid authentication token
   */
  async ensureAuthenticated(): Promise<string> {
    const username = process.env.TOP_TEX_USERNAME;
    const password = process.env.TOP_TEX_PASSWORD;

    try {
      const token = await ensureAuthenticated(
        this.baseUrl,
        this.apiKey,
        username,
        password,
        this.token,
        this.tokenExpiry
      );

      // If a new token was generated
      if (token !== this.token) {
        this.token = token;
        this.tokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
      }

      return this.token;
    } catch (error) {
      console.error("Error in client.ensureAuthenticated:", error);
      throw error;
    }
  }

  /**
   * Process raw product data into a standardized format
   */
  public processProductData(product: RawProductData): TopTexProduct {
    return processProductData(product);
  }

  /**
   * Get products by brand
   */
  async getProductsByBrand(
    brand: string,
    usageRight: string = "b2b_uniquement"
  ): Promise<TopTexProduct[]> {
    await this.ensureAuthenticated();
    return getProductsByBrand(this.baseUrl, this.getHeaders(), brand, usageRight);
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(params: ProductCategoryParams): Promise<TopTexProductsResponse> {
    await this.ensureAuthenticated();
    return getProductsByCategory(this.baseUrl, this.getHeaders(), params);
  }

  /**
   * Get product details by SKU
   */
  async getProductDetails(sku: string): Promise<TopTexProduct | null> {
    const token = await this.ensureAuthenticated();
    return getProductDetails(this.baseUrl, this.apiKey, token, sku);
  }

  /**
   * Get product by catalog reference
   */
  async getProductByCatalogReference(
    catalogReference: string,
    options: ProductReferenceOptions = {}
  ): Promise<TopTexProduct | null> {
    await this.ensureAuthenticated();
    return getProductByCatalogReference(this.baseUrl, this.getHeaders(), catalogReference, options);
  }
}

// Singleton instance
let topTexClientInstance: TopTexClient | null = null;

/**
 * Factory function to get (or create) the TopTex client instance
 */
export function getTopTexClient(): TopTexClient {
  if (!topTexClientInstance) {
    topTexClientInstance = new TopTexClient();
  }
  return topTexClientInstance;
}
