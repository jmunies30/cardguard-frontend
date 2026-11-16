const DEFAULT_API_BASE_URL = 'https://rapidexplain-backend.onrender.com';

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? DEFAULT_API_BASE_URL;

export const PREDICT_ENDPOINT = '/predict';
