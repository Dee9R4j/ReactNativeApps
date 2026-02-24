import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";
import { BACKEND_URL, AUTH_URL } from "@/utils/common";

interface SecureStoreState { state: { JWT: string } }

let axiosInstance: AxiosInstance | null = null;
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => { if (error) prom.reject(error); else prom.resolve(token); });
  failedQueue = [];
};

async function getTokenRaw(): Promise<string | null> {
  try {
    const json = await SecureStore.getItemAsync("secure-storage");
    if (json) { const parsed: SecureStoreState = JSON.parse(json); return parsed.state.JWT; }
  } catch (e) { console.error("Error reading token", e); }
  return null;
}

export async function createAxiosInstance(): Promise<AxiosInstance> {
  if (axiosInstance) return axiosInstance;

  const instance = axios.create({ baseURL: BACKEND_URL, timeout: 10000, headers: { "Content-Type": "application/json" } });

  instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const token = await getTokenRaw();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  }, (error) => Promise.reject(error));

  instance.interceptors.response.use((response) => response, async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => { failedQueue.push({ resolve, reject }); })
          .then((token) => { originalRequest.headers.Authorization = `Bearer ${token}`; return instance(originalRequest); })
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const currentToken = await getTokenRaw();
        const refreshResponse = await axios.post(`${AUTH_URL}/refresh`, { token: currentToken });
        const { access } = refreshResponse.data;
        const storeJson = await SecureStore.getItemAsync("secure-storage");
        if (storeJson) {
          const parsed = JSON.parse(storeJson);
          parsed.state.JWT = access;
          await SecureStore.setItemAsync("secure-storage", JSON.stringify(parsed));
        }
        processQueue(null, access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return instance(originalRequest);
      } catch (err: any) { processQueue(err, null); return Promise.reject(err); }
      finally { isRefreshing = false; }
    }
    return Promise.reject(error);
  });

  axiosInstance = instance;
  return instance;
}

export async function getAxiosInstance(): Promise<AxiosInstance> {
  if (!axiosInstance) return await createAxiosInstance();
  return axiosInstance;
}
