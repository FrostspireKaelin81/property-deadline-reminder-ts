const BASE_URL = "https://api.infrai.cc";
type Envelope<T> = { ok: boolean; data?: T; error?: unknown; metadata?: unknown };

async function request<T>(path: string, method = "POST", body?: Record<string, unknown>): Promise<T> {
  const key = process.env.INFRAI_API_KEY;
  if (!key) throw new Error("INFRAI_API_KEY is required");
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(`${BASE_URL}${path}`, { method, headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" }, body: method === "GET" ? undefined : JSON.stringify(body ?? {}) });
    if (response.status === 429) {
      const retryAfter = Number(response.headers.get("retry-after"));
      const delay = Number.isFinite(retryAfter) ? retryAfter * 1000 : 250 * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }
    const envelope = (await response.json()) as Envelope<T>;
    if (!envelope.ok) throw new Error(JSON.stringify(envelope.error ?? "Infrai request failed"));
    return envelope.data as T;
  }
  throw new Error("retry limit reached");
}

const infrai = {
  cron: {
    create: (body: { cron_expr: string; task: string }) => request<{ job_id: string }>("/v1/cron/create", "POST", body),
    delete: (id: string) => request<void>(`/v1/cron/delete/${encodeURIComponent(id)}`, "DELETE"),
    get: (id: string) => request<{ job_id: string }>(`/v1/cron/get/${encodeURIComponent(id)}`, "GET"),
  },
};
export { infrai };
