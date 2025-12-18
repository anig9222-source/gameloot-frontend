// Production configuration
// This file is used when environment variables are not available (e.g., Cloudflare Pages)

const isDevelopment = process.env.NODE_ENV === 'development';

export const config = {
  backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL || 'https://gameloot-backend.onrender.com',
  apiPath: process.env.EXPO_BACKEND_API_URL || '/api',
  isDevelopment,
};

export default config;
