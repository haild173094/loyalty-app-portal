// Shopify App bridge config file
import { AppBridgeConfig, AppBridgeFetchConfig } from '@/services/appBridge';

const apiURL = import.meta.env.VITE_API_URL;
const {
  key,
  host,
  app_slug: appSlug,
} = (window as any).qikifyEmbeddedData;

export const APP_BRIDGE_CONFIG: AppBridgeConfig = {
  apiKey: key,
  host: host,
};

export const APP_BRIDGE_FETCH_CONFIG: AppBridgeFetchConfig = {
  appSlug: appSlug,
  apiURL: apiURL,
};
