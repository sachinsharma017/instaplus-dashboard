// Centralized API configuration for production (Vercel Serverless) & local development
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE = isLocal ? 'http://localhost:5000' : '';
