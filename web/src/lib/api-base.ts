export const getApiBaseUrl = (): string =>
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:5044'
