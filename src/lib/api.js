const DEFAULT_BASE_URL = "http://localhost:5000";

export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  return (envUrl && String(envUrl).trim()) || DEFAULT_BASE_URL;
};

export const apiFetch = async (path, { token, method, headers, body } = {}) => {
  const url = `${getApiBaseUrl()}${path}`;

  const finalHeaders = {
    "Content-Type": "application/json",
    ...(headers || {}),
  };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: method || (body ? "POST" : "GET"),
    headers: finalHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const message =
      (payload && typeof payload === "object" && payload.message) ||
      (typeof payload === "string" && payload) ||
      `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return payload;
};
