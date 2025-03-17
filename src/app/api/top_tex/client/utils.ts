import {
  RawProductData,
  TopTexProduct,
  TopTexError,
  TopTexColor,
  TopTexSize,
  TopTexMultiLangText,
  TopTexImage,
} from "../types";

/**
 * Generate headers for API requests
 */
export function getHeaders(apiKey: string, token: string | null, withAuth = true): HeadersInit {
  const headers: HeadersInit = {
    "x-api-key": apiKey,
    "Content-Type": "application/json",
  };

  if (withAuth && token) {
    headers["x-toptex-authorization"] = token;
  }

  return headers;
}

/**
 * Handle API responses and convert to the expected type
 */
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData: TopTexError = await response.json();
    throw new Error(`TopTex API error: ${errorData.message || response.statusText}`);
  }

  // Some endpoints may return a file or empty content
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return {} as T;
}

/**
 * Process raw product data from the API into a standardized format
 */
export function processProductData(product: RawProductData): TopTexProduct {
  // If the product is empty or null, return an empty object
  if (!product) {
    console.warn("Attempt to process an empty or null product");
    return {} as TopTexProduct;
  }

  console.log("Processing product with catalogReference:", product.catalogReference);

  // SKU extraction
  let sku = "";
  let colorCode = "";
  let sizeCode = "";
  let colorInfo: TopTexColor[] = [];
  let sizeInfo: TopTexSize[] = [];

  // Check if the product has colors with sizes containing the SKU
  if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
    // Extract color information
    colorInfo = product.colors.map((color) => {
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

    // Use the first color to extract SKU
    const firstColor = product.colors[0];
    colorCode = firstColor.colorCode || "";

    // Check if this color has sizes
    if (firstColor.sizes && Array.isArray(firstColor.sizes) && firstColor.sizes.length > 0) {
      // Extract size information
      sizeInfo = firstColor.sizes.map((size) => ({
        code: size.sizeCode || "",
        name: size.size || "",
        sku: size.sku || "",
      }));

      // Use the first size for the SKU
      const firstSize = firstColor.sizes[0];
      sizeCode = firstSize.sizeCode || "";
      sku = firstSize.sku || "";
    }
  }

  // If no SKU was found, build one
  if (!sku && product.catalogReference) {
    // If we have a catalog reference and color/size codes, build a SKU
    sku = product.catalogReference;
    if (colorCode) {
      sku += `_${colorCode}`;
      if (sizeCode) {
        sku += `_${sizeCode}`;
      }
    }
  }

  // Image processing
  let images: (string | TopTexImage)[] = [];

  // Try to extract images from the product
  if (product.images && Array.isArray(product.images)) {
    images = product.images.map((img) => (typeof img === "string" ? img : { url: img.url || "" }));
  }

  // If we have colors with packshots, add them to the images
  if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
    const firstColor = product.colors[0];
    if (firstColor.packshots) {
      const packshots = Object.values(firstColor.packshots);
      const packshotUrls = packshots
        .filter((ps) => ps && ps.url)
        .map((ps) => ({ url: ps.url as string }));

      if (packshotUrls.length > 0) {
        images = [...images, ...packshotUrls];
      }
    }
  }

  // Public price processing - Handle both number and string cases
  let publicPrice: number | undefined = undefined;
  let priceValue: number | undefined = undefined;

  if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
    const firstColor = product.colors[0];
    if (firstColor.sizes && Array.isArray(firstColor.sizes) && firstColor.sizes.length > 0) {
      const firstSize = firstColor.sizes[0];
      const rawPrice = firstSize.publicUnitPrice;

      if (rawPrice !== undefined && rawPrice !== null) {
        if (typeof rawPrice === "number") {
          publicPrice = rawPrice;
          priceValue = rawPrice;
        } else if (typeof rawPrice === "string") {
          // Convert string price like "14,96 €" to number 14.96
          try {
            const parsedPrice = parseFloat(rawPrice.replace(/[^\d,.-]/g, "").replace(",", "."));
            if (!isNaN(parsedPrice)) {
              publicPrice = parsedPrice;
              priceValue = parsedPrice;
            }
          } catch {
            // Keep it undefined if parsing fails
          }
        }
      }
    }
  }

  // Process designation
  const designation: string | TopTexMultiLangText = product.designation
    ? product.designation
    : "Produit sans titre";

  // Process description
  const description: string | TopTexMultiLangText | undefined = product.description;

  // Process family and subfamily
  const family: string | TopTexMultiLangText | undefined = product.family;
  const subfamily: string | TopTexMultiLangText | undefined = product.sub_family;

  // Process composition
  const composition: string | TopTexMultiLangText | undefined = product.composition;

  // Create the final product object
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
    publicPrice: publicPrice, // Using undefined instead of null
    price: priceValue, // Using undefined instead of null
    prices: [], // Empty array by default
    images: images,
    colors: colorInfo,
    sizes: sizeInfo,
    mainImage:
      images && images.length > 0
        ? typeof images[0] === "string"
          ? images[0]
          : images[0].url
        : "/images/product-placeholder.jpg",
    // Other properties
    composition: composition,
    weight: product.averageWeight || product.weight || "",
    labelType: product.labelType || "",
  };
}
