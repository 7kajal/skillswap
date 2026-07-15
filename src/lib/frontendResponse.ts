export interface FrontendResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

export async function apiFetch<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<FrontendResponse<T>> {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...options?.headers },
      ...options,
    });

    const json: FrontendResponse<T> = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: json.message || "Something went wrong",
        data: null,
      };
    }

    return json;
  } catch {
    return {
      success: false,
      message: "Network error. Please try again.",
      data: null,
    };
  }
}

export async function apiGet<T = unknown>(url: string): Promise<FrontendResponse<T>> {
  return apiFetch<T>(url);
}

export async function apiPost<T = unknown>(
  url: string,
  body?: unknown
): Promise<FrontendResponse<T>> {
  return apiFetch<T>(url, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPatch<T = unknown>(
  url: string,
  body?: unknown
): Promise<FrontendResponse<T>> {
  return apiFetch<T>(url, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiDelete<T = unknown>(url: string): Promise<FrontendResponse<T>> {
  return apiFetch<T>(url, { method: "DELETE" });
}
