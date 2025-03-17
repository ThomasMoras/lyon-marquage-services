// types/toptex.ts

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

  // Attributs supplémentaires (ajoutez selon vos besoins)
  style?: TopTexMultiLangText[] | string;
  gender?: TopTexMultiLangText[] | string;
  collection?: string;

  // Champ pour stocker les données originales si nécessaire
  // _original?: any;
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

export interface Color {
  hexaCode?: string;
  name?: string;
}

export interface ProductImage {
  url: string;
}

export interface ProductDesignation {
  fr?: string;
  en?: string;
}

export interface Product {
  sku?: string;
  catalogReference?: string;
  mainImage?: string;
  images?: Array<string | ProductImage>;
  designation: string | ProductDesignation;
  price?: number;
  publicPrice?: number;
  brand?: string;
  colors?: Color[];
}

export interface ProductCardProps {
  product: TopTexProduct;
}

export interface ProductResult {
  product: TopTexProduct;
  relatedProducts?: TopTexProduct[];
}
