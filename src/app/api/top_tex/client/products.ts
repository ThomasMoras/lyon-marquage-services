import {
  TopTexProduct,
  TopTexProductsResponse,
  ProductCategoryParams,
  ProductReferenceOptions,
  RawProductData,
} from "../types";
import { processProductData } from "./utils";

/**
 * Get products by brand
 */
export async function getProductsByBrand(
  baseUrl: string,
  headers: HeadersInit,
  brand: string,
  usageRight: string = "b2b_uniquement"
): Promise<TopTexProduct[]> {
  const url = new URL(`${baseUrl}/v3/products/all`);
  url.searchParams.append("brand", brand);
  url.searchParams.append("usage_right", usageRight);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
  });

  const data = await response.json();
  let products: RawProductData[] = [];

  // Check if the response is an array or an object with an items property
  if (Array.isArray(data)) {
    products = data;
  } else if (data && Array.isArray(data.items)) {
    products = data.items;
  } else if (data) {
    // Loop through numeric properties that might contain products
    for (const key in data) {
      if (!isNaN(Number(key)) && typeof data[key] === "object") {
        products.push(data[key] as RawProductData);
      }
    }
  } else {
    console.warn("Unexpected response format:", data);
    products = [];
  }

  // Process each product to extract important information
  return products.map((product) => processProductData(product));
}

/**
 * Get products by category
 */
export async function getProductsByCategory(
  baseUrl: string,
  headers: HeadersInit,
  params: ProductCategoryParams
): Promise<TopTexProductsResponse> {
  try {
    const { family, subfamily, usageRight = "b2b_b2c", pageNumber = 1, pageSize = 10 } = params;

    // Build the API URL
    const url = new URL(`${baseUrl}/v3/products/all`);
    url.searchParams.append("family", family);
    url.searchParams.append("subfamily", subfamily);
    url.searchParams.append("usage_right", usageRight);
    url.searchParams.append("page_number", pageNumber.toString());
    url.searchParams.append("page_size", pageSize.toString());

    console.log(`Getting products with URL: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response received");

    // Determine the format of the received data
    let products: RawProductData[] = [];
    let totalCount = 0;
    let totalPages = 0;

    if (Array.isArray(data)) {
      // Case 1: The response is an array of products
      console.log("Response format: product array");
      products = data;
      totalCount = data.length;
      totalPages = Math.ceil(totalCount / pageSize);
    } else if (data && typeof data === "object") {
      // Case 2: The response is an object that may contain a numeric list of products
      // Check if there are numeric keys (such as 0, 1, 2...)
      const numericKeys = Object.keys(data).filter((key) => !isNaN(Number(key)));

      if (numericKeys.length > 0) {
        console.log("Response format: object with numeric keys");
        // Extract products from numeric keys
        numericKeys.forEach((key) => {
          if (data[key] && typeof data[key] === "object") {
            products.push(data[key] as RawProductData);
          }
        });

        // Get pagination information if available
        totalCount = data.total_count ? parseInt(data.total_count as string) : products.length;
        totalPages = data.total_pages
          ? parseInt(data.total_pages as string)
          : Math.ceil(totalCount / pageSize);
      } else if (data.items && Array.isArray(data.items)) {
        // Case 3: The response is an object with an "items" property
        console.log("Response format: object with items property");
        products = data.items;
        totalCount = data.total_count ? parseInt(data.total_count as string) : products.length;
        totalPages = data.total_pages
          ? parseInt(data.total_pages as string)
          : Math.ceil(totalCount / pageSize);
      } else {
        // Case 4: Unexpected format
        console.warn("Unexpected response format:", Object.keys(data));

        // If it's a single product object (without pagination), treat it as such
        if (data.catalogReference) {
          console.log("Response format: single product");
          products = [data as RawProductData];
          totalCount = 1;
          totalPages = 1;
        }
      }
    }

    console.log(`Number of products found: ${products.length}`);

    // Now, process each product to normalize its structure
    const processedProducts = products.map((product) => processProductData(product));

    console.log(`Processed products: ${processedProducts.length}`);
    if (processedProducts.length > 0) {
      console.log("First processed product:", {
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
    console.error("Error getting products by category:", error);

    // Return a valid structure even in case of error
    return {
      items: [],
      total: 0,
      page: params.pageNumber || 1,
      pageSize: params.pageSize || 10,
      totalPages: 0,
    };
  }
}

/**
 * Get product details by SKU
 */
export async function getProductDetails(
  baseUrl: string,
  apiKey: string,
  token: string,
  sku: string
): Promise<TopTexProduct | null> {
  try {
    // Default value for usage_right
    const usageRight = "b2b_uniquement"; // or 'b2b_b2c' based on your needs

    // Detect if the SKU is complete (with underscores) or just a catalog reference
    const hasUnderscores = sku.includes("_");
    const catalogReference = hasUnderscores ? sku.split("_")[0] : sku;

    console.log(`Processing SKU: ${sku}`);
    console.log(`Detected format: ${hasUnderscores ? "Complete SKU" : "Catalog reference"}`);
    console.log(`Extracted catalog reference: ${catalogReference}`);

    // If it's a complete SKU, try direct search first
    if (hasUnderscores) {
      try {
        const url = new URL(`${baseUrl}/v3/products`);
        url.searchParams.append("sku", sku);
        url.searchParams.append("usage_right", usageRight);

        console.log(`Attempting to retrieve by complete SKU:`, url.toString());

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "x-api-key": apiKey,
            "x-toptex-authorization": token,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();

          if (Array.isArray(data) && data.length > 0) {
            return processProductData(data[0]);
          } else if (data && typeof data === "object" && !Array.isArray(data)) {
            return processProductData(data);
          } else {
            console.log("No result with complete SKU, switching to catalog reference search");
          }
        } else {
          console.log(
            `Complete SKU search failed (${response.status}), switching to catalog reference search`
          );
        }
      } catch (error) {
        console.error("Error during complete SKU search:", error);
      }
    }

    // Search by catalog reference
    try {
      const url = new URL(`${baseUrl}/v3/products`);
      url.searchParams.append("usage_right", usageRight);
      url.searchParams.append("catalog_reference", catalogReference);

      console.log(`Attempting to retrieve by catalog reference:`, url.toString());

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          "x-toptex-authorization": token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        return null;
      }

      const data = await response.json();
      let products: RawProductData[] = [];

      if (Array.isArray(data) && data.length > 0) {
        products = data;
        console.log(
          `Found ${products.length} product(s) with the catalog reference ${catalogReference}`
        );
      } else if (data && Array.isArray(data.items)) {
        products = data.items;
        console.log(
          `Found ${products.length} product(s) (items format) with the catalog reference ${catalogReference}`
        );
      } else if (data) {
        // Loop through numeric properties that might contain products
        for (const key in data) {
          if (!isNaN(Number(key)) && typeof data[key] === "object") {
            products.push(data[key] as RawProductData);
          }
        }
        console.log(
          `Found ${products.length} product(s) (indexed format) with the catalog reference ${catalogReference}`
        );
      } else {
        console.log(`No product found with the catalog reference ${catalogReference}`);
      }

      // If complete SKU, try to find an exact match
      if (hasUnderscores && products.length > 0) {
        const exactMatch = products.find((p) => p.sku === sku);
        if (exactMatch) {
          console.log(`Exact match found for SKU ${sku}`);
          return processProductData(exactMatch);
        }
      }

      // If no exact match but we have at least one product, take the first one
      if (products.length > 0) {
        console.log(
          `Using the first available product for ${catalogReference} (${
            products[0].sku || "no SKU"
          })`
        );
        return processProductData(products[0]);
      }
    } catch (error) {
      console.error("Error during catalog reference search:", error);
    }

    // If all attempts fail
    console.warn(`No product found for reference: ${sku}`);
    return null;
  } catch (error) {
    console.error("Global error in getProductDetails:", error);
    throw error;
  }
}

/**
 * Get product by catalog reference
 */
export async function getProductByCatalogReference(
  baseUrl: string,
  headers: HeadersInit,
  catalogReference: string,
  options: ProductReferenceOptions = {}
): Promise<TopTexProduct | null> {
  try {
    // Default parameters
    const usageRight = options.usageRight || "b2b_uniquement";

    // Build the API URL
    const url = new URL(`${baseUrl}/v3/products`);
    url.searchParams.append("catalog_reference", catalogReference);
    url.searchParams.append("usage_right", usageRight);

    // Add languages if specified
    if (options.lang && options.lang.length > 0) {
      url.searchParams.append("lang", options.lang.join(","));
    }

    // Add color code if specified
    if (options.color) {
      url.searchParams.append("color", options.color);
    }

    console.log(
      `Getting product with catalog reference ${catalogReference} via URL: ${url.toString()}`
    );

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`API Response received for catalog reference ${catalogReference}`);

    // Determine the format of the received data
    let products: RawProductData[] = [];

    if (Array.isArray(data)) {
      // Case 1: The response is an array of products
      console.log(`Response format: product array (${data.length})`);
      products = data;
    } else if (data && typeof data === "object") {
      // Case 2: The response is an object that may contain a numeric list of products
      const numericKeys = Object.keys(data).filter((key) => !isNaN(Number(key)));

      if (numericKeys.length > 0) {
        console.log(`Response format: object with numeric keys (${numericKeys.length})`);
        numericKeys.forEach((key) => {
          if (data[key] && typeof data[key] === "object") {
            products.push(data[key] as RawProductData);
          }
        });
      } else if (data.items && Array.isArray(data.items)) {
        // Case 3: The response is an object with an "items" property
        console.log(`Response format: object with items property (${data.items.length})`);
        products = data.items;
      } else if (data.catalogReference === catalogReference) {
        // Case 4: The response is directly a product object
        console.log("Response format: single product");
        products = [data as RawProductData];
      } else {
        console.warn("Unexpected response format:", Object.keys(data));
      }
    }

    console.log(`Number of products found for reference ${catalogReference}: ${products.length}`);

    // If no product is found, return null
    if (products.length === 0) {
      return null;
    }

    // Process the first product found
    const processedProduct = processProductData(products[0]);

    console.log("Processed product:", {
      sku: processedProduct.sku,
      catalogReference: processedProduct.catalogReference,
      designation: processedProduct.designation,
      colors: processedProduct.colors?.length || 0,
      sizes: processedProduct.sizes?.length || 0,
      images: processedProduct.images?.length || 0,
    });

    return processedProduct;
  } catch (error) {
    console.error(`Error getting product with catalog reference ${catalogReference}:`, error);
    return null;
  }
}
