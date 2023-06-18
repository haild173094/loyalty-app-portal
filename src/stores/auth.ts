import { defineStore } from 'pinia';
import { AUTH_CONFIG } from '@/configs';

interface IToken {
  app: string,
  shop: string,
  timestamp?: string,
  token: string,
}

interface IAuthState {
  status: string | null,
  shop: Record<string, any> | null,
  user: Record<string, any> | null,
  token: IToken | null,
}

/**
 * Multiple app tokens support
 * Token stored in an array name: tokens
 */
const defaultState: IAuthState = {
  status: AUTH_CONFIG.loading,
  shop: null,
  user: null,
  token: null,
};

export const useAuthStore = defineStore({
  id: 'auth',

  state: () => defaultState,

  getters: {
    shopSlug: (state: IAuthState): string => {
      const domain = state.shop?.myshopify_domain || '';

      return domain.replace('.myshopify.com', '');
    },

    shopDomain: (state: IAuthState): string => state.shop?.myshopify_domain || '',
  },

  actions: {
    login(tokenData: IToken): Promise<void> {
      this.token = tokenData;

      return new Promise(resolve => (this.instance
        ? resolve()
        : resolve(this.collectUserData())
      ));
    },

    handleLoginSuccess(tokenData: Record<string, any>): Promise<void> {
      this.storeToken(tokenData);

      return new Promise(resolve => resolve(this.collectUserData()));
    },

    storeToken(tokenData: Record<string, string>): void {
      const {
        app,
        shop,
        timestamp,
        token,
      } = tokenData;
      const newToken = {
        app,
        shop,
        timestamp,
        token,
      };

      this.token = newToken;
    },

    collectUserData(): void {
      const {
        shop, user,
      } = (window as any).window.qikifyEmbeddedData;

      if (!shop) {
        this.status = AUTH_CONFIG.error;
      }

      const userData = {
        shop,
        user,
      };

      this.setUserData(userData);
    },

    setUserData(userData: Record<string, any>): void {
      const {
        shop,
        user,
      } = userData;

      this.status = AUTH_CONFIG.success;
      this.shop = shop;
      this.user = user;
    },

    clearUserData(): void {
      this.shop = null;
      this.user = null;
    },
  },
});
