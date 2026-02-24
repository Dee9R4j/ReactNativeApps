/**
 * API Helpers
 * Smart error parsing for backend responses
 */
import { AxiosError } from "axios";

interface BackendErrorResponse {
  display_message?: string;
  detail?: string | Record<string, string[]>;
  message?: string;
  [key: string]: unknown;
}

const isAxiosError = (error: unknown): error is AxiosError =>
  (error as AxiosError)?.isAxiosError === true;

const formatFieldErrors = (obj: Record<string, string[]>): string =>
  Object.entries(obj)
    .map(([key, msgs]) => `${key}: ${msgs.join(", ")}`)
    .join("; ");

const extractFieldErrors = (data: BackendErrorResponse): string | null => {
  const knownKeys = new Set(["display_message", "detail", "message"]);
  const fieldErrors: string[] = [];

  for (const [key, val] of Object.entries(data)) {
    if (knownKeys.has(key)) continue;
    if (Array.isArray(val) && val.every((v) => typeof v === "string")) {
      fieldErrors.push(`${key}: ${val.join(", ")}`);
    }
  }

  return fieldErrors.length > 0 ? fieldErrors.join("; ") : null;
};

export const parseBackendError = (error: unknown): string => {
  if (isAxiosError(error)) {
    const responseData = error.response?.data as BackendErrorResponse | undefined;

    if (responseData) {
      if (responseData.display_message && typeof responseData.display_message === "string")
        return responseData.display_message;

      if (responseData.detail) {
        if (typeof responseData.detail === "string") return responseData.detail;
        if (typeof responseData.detail === "object") return formatFieldErrors(responseData.detail);
      }

      const fieldErrors = extractFieldErrors(responseData);
      if (fieldErrors) return fieldErrors;

      if (responseData.message && typeof responseData.message === "string")
        return responseData.message;
    }

    if (error.code === "ERR_NETWORK") return "Network error. Please check your connection.";
    if (error.code === "ECONNABORTED") return "Request timed out. Please try again.";

    const status = error.response?.status;
    if (status) {
      const statusMessages: Record<number, string> = {
        400: "Invalid request. Please check your input.",
        401: "Session expired. Please login again.",
        403: "You don't have permission to perform this action.",
        404: "Resource not found.",
        422: "Validation error. Please check your input.",
        429: "Too many requests. Please wait a moment.",
        500: "Server error. Please try again later.",
        502: "Service temporarily unavailable.",
        503: "Service temporarily unavailable.",
        504: "Service temporarily unavailable.",
      };
      if (statusMessages[status]) return statusMessages[status];
    }
  }

  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred. Please try again.";
};
