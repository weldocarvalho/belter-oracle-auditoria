const TOKEN_KEY = "belter.access_token";

export interface SessionUser {
  id: string;
  email: string;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setSession(token: string, user: SessionUser): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem("belter.user", JSON.stringify(user));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem("belter.user");
}

export function getSessionUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("belter.user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken() && getSessionUser());
}

export const BFF_URL =
  process.env.NEXT_PUBLIC_BFF_URL || "http://localhost:3333";

export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3333";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BFF_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string | string[] }
      | null;
    const message = Array.isArray(payload?.message)
      ? payload.message[0]
      : payload?.message;
    throw new Error(message || `Erro ${response.status} na requisição.`);
  }

  return (await response.json()) as T;
}

export function buildWsUrl(): string {
  const token = getAccessToken();
  const params = new URLSearchParams();
  if (token) {
    params.set("token", token);
  }
  return `${WS_URL}?${params.toString()}`;
}
