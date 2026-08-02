export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') || 'https://bullsye.app';

export const MARKET_POLL_MS = 10_000;
export const MARKET_STALE_MS = 8_000;

export const APP_BUNDLE_ID = 'com.bullsye.app';
