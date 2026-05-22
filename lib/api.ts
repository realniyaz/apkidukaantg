// lib/api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE) {
  console.warn("⚠️ NEXT_PUBLIC_API_URL is not defined in .env.local");
}

/**
 * ✅ NEW: cleanDecimal Utility
 * Converts messy/bloated backend Decimal strings into clean JavaScript numbers.
 * Exported so it can be used in PurchaseForm and Sales components.
 */
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
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  /**
   * 1. URL SANITIZATION
   */
  const base = (API_BASE ?? "").replace(/\/+$/, "");
  const path = endpoint.replace(/^\/+/, "");
  const url = `${base}/${path}`; 

  const method = options.method || "GET";

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
      body: (method === "GET" || method === "HEAD") ? undefined : options.body,
    });

    /**
     * 2. HANDLE SESSION EXPIRATION (401)
     */
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        if (!window.location.pathname.includes("/auth/login")) {
          window.location.href = "/auth/login";
        }
      }
      throw new Error("Neural Session Terminated. Please re-authenticate.");
    }

    /**
     * 3. PARSE DATA SAFELY
     */
    let data: any = null;
    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    /**
     * 4. LOGIC ERROR PARSING
     */
    if (!response.ok) {
      let errorMessage = "Node Communication Error.";

      if (data?.detail) {
        if (Array.isArray(data.detail)) {
          errorMessage = data.detail.map((e: any) => `${e.loc[1] || 'error'}: ${e.msg}`).join(", ");
        } else {
          errorMessage = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
        }
      } else if (data?.message) {
        errorMessage = data.message;
      } else {
        errorMessage = `Protocol Error ${response.status}: ${response.statusText}`;
      }
        
      throw new Error(errorMessage);
    }

    return data as T;

  } catch (error: any) {
    /**
     * 5. NETWORK FAILURE HANDLING
     */
    if (error.message === "Failed to fetch") {
      console.error(`🔴 Connection Refused [${method}] ${url}`);
      throw new Error("Neural Link Offline: Check FastAPI Server status.");
    }
    
    console.error(`🔴 API Trace [${method}] ${url}:`, error.message);
    throw error;
  }
}