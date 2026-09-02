// HTTP client: uniform JSON handling, uniform errors (with a status code, since callers need to recognize things like 409).
export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(path, {
        ...options,
        headers: { 'content-type': 'application/json', ...options?.headers },
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new ApiError(body.error || `HTTP ${response.status}`, response.status);
    return body as T;
}

export const api = {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
    patch: <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
    put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
    del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
