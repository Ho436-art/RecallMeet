const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("recallmeet_token");
}

export function setAuthToken(token: string): void {
  localStorage.setItem("recallmeet_token", token);
}

export function clearAuthToken(): void {
  localStorage.removeItem("recallmeet_token");
}

async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getAuthToken();

  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorData = await response.json();

      if (typeof errorData.detail === "string") {
        message = errorData.detail;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}


export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest(endpoint, {
    method: "GET",
  });
}


export async function apiPost<T>(
  endpoint: string,
  body?: unknown
): Promise<T> {
  return apiRequest(endpoint, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}


export async function apiPatch<T>(
  endpoint: string,
  body?: unknown
): Promise<T> {
  return apiRequest(endpoint, {
    method: "PATCH",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}


export async function apiPostForm<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  return apiRequest(endpoint, {
    method: "POST",
    body: formData,
  });
}


export async function apiDelete<T = void>(endpoint: string): Promise<T> {
  return apiRequest(endpoint, {
    method: "DELETE",
  });
}