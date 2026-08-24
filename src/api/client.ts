import { apiUrl } from './paths';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly fieldErrors?: Record<string, string>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export type ListResponse<TRow, TCounts = undefined> = {
  rows: TRow[];
  total: number;
  counts: TCounts;
};

type JsonBody = object | undefined;

const request = async <T>(
  method: string,
  path: string,
  body?: JsonBody
): Promise<T> => {
  const response = await fetch(apiUrl(path), {
    method,
    headers:
      body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      message?: string;
      fieldErrors?: Record<string, string>;
    } | null;

    throw new ApiError(
      response.status,
      payload?.message ?? `Request failed with status ${response.status}`,
      payload?.fieldErrors
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
};

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: JsonBody) => request<T>('POST', path, body),
  patch: <T>(path: string, body?: JsonBody) => request<T>('PATCH', path, body),
  put: <T>(path: string, body?: JsonBody) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};

export const buildQuery = (
  params: Record<string, string | number | undefined>
) => {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue;
    search.set(key, String(value));
  }

  const query = search.toString();
  return query ? `?${query}` : '';
};
