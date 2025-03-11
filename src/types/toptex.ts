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

export interface TopTexProduct {
  sku: string;
  catalogReference: string;
  designation: string;
  colorCode: string;
  sizeCode: string;
  color: string;
  size: string;
  brand?: string;
  family?: string;
  subfamily?: string;
  packaging?: number;
  publicPrice?: number;
  prices?: TopTexProductPrice[];
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
