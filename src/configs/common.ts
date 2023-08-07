export const APP_LIST = ['stickycart'];

export const ShopifyAdminUrl = 'https://admin.shopify.com';

export const REQUEST_CONFIG = {
  productLimit: 20,
  variantLimit: 20,
  entriesLimit: 20,
};

const {
  app_slug: appSlug,
  shop,
} = (window as any).qikifyEmbeddedData;

export const APP_CONFIG_COMMON = {
  env: import.meta.env.VITE_NODE_ENV,
  chatKey: 'dbc2a5ba-52c5-4692-ae5a-f72fb8286b14',
  affiliateScript: import.meta.env.VITE_APP_AFFILIATE_SCRIPT,
  embeddedUrl: import.meta.env.VITE_EMBEDDED_URL,
  appSlug: appSlug,
  shopDomainName: shop?.myshopify_domain,
};
