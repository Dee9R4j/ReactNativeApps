import axios, { AxiosInstance, AxiosHeaders } from "axios";
import * as SecureStore from "expo-secure-store";
import { BACKEND_URL } from "@/utils/common";

interface TokenData {
  JWT: string;
}

interface SecureStoreState {
  state: {
    JWT: string;
  };
}

let axiosInstance: AxiosInstance | null = null;

export async function createAxiosInstance(): Promise<AxiosInstance> {
  if (axiosInstance) {
    return axiosInstance;
  }

  const instance = axios.create({
    baseURL: BACKEND_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Get tokens from secure storage
  const tokens = await getTokensFromStorage();
  if (!tokens) {
    throw new Error("No authentication tokens found");
  }

  // Request interceptor to add auth header
  instance.interceptors.request.use(
    async (config) => {
      const latestTokens = await getTokensFromStorage();
      const authToken = latestTokens?.JWT;

      if (authToken) {
        const headers =
          config.headers instanceof AxiosHeaders
            ? config.headers
            : AxiosHeaders.from(config.headers || {});

        headers.set("Authorization", `Bearer ${authToken}`);
        config.headers = headers;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance = instance;

  return instance;
}

/**
 * Retrieves authentication tokens from secure storage.
 *
 * @returns A promise that resolves to a TokenData object containing access and refresh tokens,
 *          or null if no tokens are found or an error occurs during retrieval.
 *
 * @throws Will log an error to the console if storage access fails, but returns null instead of throwing.
 *
 * @example
 * ```typescript
 * const tokens = await getTokensFromStorage();
 * if (tokens) {
 *   console.log('Access token:', tokens.accessToken);
 *   console.log('Refresh token:', tokens.refreshToken);
 * }
 * ```
 */
export async function getTokensFromStorage(): Promise<TokenData | null> {
  try {
    const secureStore = await SecureStore.getItemAsync("secure-storage");
    if (secureStore) {
      const parsed: SecureStoreState = JSON.parse(secureStore);
      return {
        JWT: parsed.state.JWT,
      };
    }
    return null;
  } catch (error: any) {
    console.error("Error getting tokens from storage:", error);
    return null;
  }
}

// todo: set this in the state for synchronous access
// Helper function to get current instance
export async function getAxiosInstance(): Promise<AxiosInstance> {
  const tokens = await getTokensFromStorage();
  if (!axiosInstance) {
    return await createAxiosInstance();
  }
  return axiosInstance;
}

// Helper function to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const tokens = await getTokensFromStorage();
  return !!tokens?.JWT;
}
