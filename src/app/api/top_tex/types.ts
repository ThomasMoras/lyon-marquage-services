// Types used throughout the TopTex API client

export interface TopTexAuthResponse {
  token: string;
}

export interface TopTexAuthRequest {
  username: string;
  password: string;
}

export interface TopTexProductPrice {
  quantity: string;
  price: number;
  modificationDate: string;
}

export interface TopTexColor {
  code: string;
  name: string;
  hexaCode?: string;
}

export interface TopTexSize {
  code: string;
  name: string;
  sku?: string;
}

export interface TopTexImage {
  url: string;
  image_id?: string;
  type?: string;
  last_update?: string;
}

export interface TopTexMultiLangText {
  fr?: string;
  en?: string;
  de?: string;
  es?: string;
  it?: string;
  nl?: string;
  pt?: string;
  [key: string]: string | undefined;
}

export interface TopTexProduct {
  // Identifiants du produit
  sku: string;
  catalogReference: string;

  // Informations de base
  designation: string | TopTexMultiLangText;
  description?: string | TopTexMultiLangText;
  composition?: string | TopTexMultiLangText;

  // Attributs de variation
  colorCode?: string;
  sizeCode?: string;
  color?: string;
  size?: string;

  // Catégorisation
  brand?: string;
  family?: string | TopTexMultiLangText;
  subfamily?: string | TopTexMultiLangText;

  // Prix et inventaire
  packaging?: number;
  publicPrice?: number;
  price?: number | string; // Pour l'interface utilisateur
  prices?: TopTexProductPrice[];

  // Médias
  images?: (string | TopTexImage)[];
  mainImage?: string;

  // Variations disponibles
  colors?: TopTexColor[];
  sizes?: TopTexSize[];

  // Attributs techniques
  weight?: string;
  labelType?: string;
  averageWeight?: string;

  // Attributs supplémentaires
  style?: TopTexMultiLangText[] | string;
  gender?: TopTexMultiLangText[] | string;
  collection?: string;
}

export interface TopTexProductsResponse {
  items: TopTexProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TopTexInventoryItem {
  sku: string;
  quantity: number;
  availableQuantity: number;
  incomingQuantity: number;
  incomingDate?: string;
  modificationDate: string;
}

export interface TopTexError {
  error: string;
  message: string;
  statusCode: number;
}

// Client-specific types
export interface RawProductData {
  catalogReference?: string;
  designation?: string | TopTexMultiLangText;
  description?: string | TopTexMultiLangText;
  composition?: string | TopTexMultiLangText;
  family?: string | TopTexMultiLangText;
  sub_family?: string | TopTexMultiLangText;
  brand?: string;
  packaging?: number;
  averageWeight?: string;
  weight?: string;
  labelType?: string;
  style?: TopTexMultiLangText[] | string;
  colors?: Array<{
    colorCode?: string;
    colors?: string | TopTexMultiLangText;
    colorsHexa?: string[];
    packshots?: Record<string, { url?: string }>;
    sizes?: Array<{
      sizeCode?: string;
      size?: string;
      sku?: string;
      publicUnitPrice?: number | string;
    }>;
  }>;
  images?: Array<string | { url: string }>;
  // Adding an index signature to handle other unexpected properties
  [key: string]: unknown;
}

export interface ProductCategoryParams {
  family: string;
  subfamily: string;
  usageRight?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface ProductReferenceOptions {
  usageRight?: string;
  lang?: string[];
  color?: string;
}
