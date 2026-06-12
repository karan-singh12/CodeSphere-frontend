import { toast } from "sonner";

export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  let url = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  return url;
};

// Helper to extract cookie value
export const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
};

// Common request options
export interface RequestOptions extends RequestInit {
  token?: string | null;
}

// Custom API fetch wrapper
export async function apiFetch(endpoint: string, options: RequestOptions = {}) {
  const baseUrl = getBaseUrl();
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;
  
  // Set headers
  const headers = new Headers(options.headers || {});
  
  // Get token from options, or read from cookie
  const token = options.token !== undefined ? options.token : getCookie("token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handle specific status codes
    if (response.status === 401) {
      // Clear cookie and redirect to login if we are in window
      if (typeof window !== "undefined") {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "/";
      }
    } else if (response.status === 402) {
      toast.error("Insufficient credits or payment required.");
    } else if (response.status === 429) {
      toast.error("Too many requests. Please try again later.");
    }
  }

  return response;
}

export async function apiGet(endpoint: string, options: RequestOptions = {}) {
  return apiFetch(endpoint, { ...options, method: "GET" });
}

export async function apiPost(endpoint: string, body?: any, options: RequestOptions = {}) {
  return apiFetch(endpoint, {
    ...options,
    method: "POST",
    body: body !== undefined ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
  });
}

export async function apiPut(endpoint: string, body?: any, options: RequestOptions = {}) {
  return apiFetch(endpoint, {
    ...options,
    method: "PUT",
    body: body !== undefined ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
  });
}

export async function apiDelete(endpoint: string, options: RequestOptions = {}) {
  return apiFetch(endpoint, { ...options, method: "DELETE" });
}
