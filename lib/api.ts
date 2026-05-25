/**
 * Optimized API Client for Apkidukaan
 * Includes advanced logging and robust error handling for Next.js 16+
 */

// 1. URL Resolution with fallback check
const getApiBase = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    console.error("❌ CRITICAL: NEXT_PUBLIC_API_URL is missing in .env.local");
    return "https://apkidukaan-backend.onrender.com"; // Fallback to production URL
  }
  return url.replace(/\/+$/, "");
};

const API_BASE = getApiBase();

export const cleanDecimal = (val: any): number => {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Ensure token is retrieved only on client-side
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // 2. URL Path Sanitization
  const path = endpoint.replace(/^\/+/, "");
  const url = `${API_BASE}/${path}`;
  const method = options.method || "GET";

  console.log(`🚀 Requesting [${method}] -> ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      method,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      // Ensure body is correctly stringified if needed, 
      // but expects stringified body from caller
      body: (method === "GET" || method === "HEAD") ? undefined : options.body,
    });

    // 3. Handle Unauthorized
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.clear();
        window.location.href = "/auth/login";
      }
      throw new Error("Session expired. Please re-authenticate.");
    }

    // 4. Safe Content Parsing
    const contentType = response.headers.get("content-type");
    let data: any = null;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    // 5. Handle Server Errors (500, 400, etc.)
    if (!response.ok) {
      const errorMessage = data?.detail || data?.message || `Protocol Error ${response.status}`;
      console.error(`🔴 API Error [${method}] ${url}:`, errorMessage);
      throw new Error(typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage));
    }

    return data as T;

  } catch (error: any) {
    // 6. Handle Network Refusals
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      console.error(`🔴 Connection Refused to [${url}]. Check Render status.`);
      throw new Error("Unable to reach backend. Service may be sleeping or offline.");
    }
    
    throw error;
  }
}