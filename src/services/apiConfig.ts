import { Configuration } from '@/api';

export const apiConfig = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL as string,
});
