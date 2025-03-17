import { TopTexAuthResponse } from "../types";

/**
 * Authenticates with the TopTex API
 * @returns A token and its expiry date
 */
export async function authenticate(
  baseUrl: string,
  apiKey: string,
  username: string,
  password: string,
  token: string | null,
  tokenExpiry: Date | null,
  forceRefresh = false
): Promise<{ token: string; tokenExpiry: Date }> {
  try {
    // If we already have a valid token and forceRefresh is not enabled, reuse it
    if (!forceRefresh && token && tokenExpiry && tokenExpiry > new Date()) {
      console.log("Using existing token (valid until", tokenExpiry.toISOString(), ")");
      return { token, tokenExpiry };
    }

    // Check parameters
    if (!username || !password) {
      throw new Error("Username and password are required for authentication");
    }

    console.log("Getting a new authentication token...");

    const response = await fetch(`${baseUrl}/v3/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Authentication error:", response.status, errorText);
      throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
    }

    // Get and verify the token
    const data = (await response.json()) as TopTexAuthResponse;

    if (!data || !data.token || typeof data.token !== "string") {
      console.error("Invalid authentication response:", data);
      throw new Error("The response does not contain a valid token");
    }

    // Store the token and its expiry date
    const newToken = data.token;
    const newTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
    console.log("New token obtained, valid until", newTokenExpiry.toISOString());

    return {
      token: newToken,
      tokenExpiry: newTokenExpiry,
    };
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
}

/**
 * Ensures we have a valid authentication token
 * @returns A valid token
 */
export async function ensureAuthenticated(
  baseUrl: string,
  apiKey: string,
  username: string | undefined,
  password: string | undefined,
  token: string | null,
  tokenExpiry: Date | null
): Promise<string> {
  try {
    if (!username || !password) {
      throw new Error("Missing credentials: TOP_TEX_USERNAME or TOP_TEX_PASSWORD");
    }

    // If we don't have a token or it has expired, request a new one
    if (!token || !tokenExpiry || tokenExpiry <= new Date()) {
      console.log("Token missing or expired, authentication required");
      const authResult = await authenticate(baseUrl, apiKey, username, password, null, null, true);
      return authResult.token;
    }

    // Otherwise return the existing token
    return token;
  } catch (error) {
    console.error("Error in ensureAuthenticated:", error);
    throw error;
  }
}
