/**
 * The service worker scope equals the Vite `base`, so API routes have to live
 * under it. This module is the single source of truth shared by the request
 * handlers and the client, so the two cannot drift apart.
 */
export const API_BASE = `${import.meta.env.BASE_URL}api`;

export const apiUrl = (path: string) => `${API_BASE}${path}`;
