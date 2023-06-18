import { useRouter } from 'vue-router';
import {
  AppBridgeState,
  AppConfigV2,
  ClientApplication,
  createApp,
} from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import { getSessionToken } from '@shopify/app-bridge-utils';
import { APP_BRIDGE_CONFIG } from '@/configs/appBridge';

// Definitions
export type AppBridgeConfig = AppConfigV2;

interface State {
  config: AppBridgeConfig,
  appBridge: ClientApplication<AppBridgeState> | null;
}

// appBridge instance state
const state: State = {
  config: APP_BRIDGE_CONFIG,
  appBridge: null,
};

export function useAppBridge() {
  if (!state.appBridge) {
    const appBridge = installAppBridge();

    state.appBridge = appBridge;
  }

  return state.appBridge;
}

export function useClientSideRouting() {
  if (!state.appBridge) {
    throw new Error('[Client side routing] App Bridge is not available.');
  }

  const router = useRouter();

  // Using client-side routing - https://shopify.dev/apps/tools/app-bridge/actions/navigation
  state.appBridge.subscribe(Redirect.Action.APP, (redirectData: Record<string, string>) => {
    router.replace({ path: redirectData.path });
  });
}

export function useGetToken() {
  return async (appBridge: ClientApplication<AppBridgeState>) => {
    const token = await getSessionToken(appBridge);

    return token;
  };
}

// Private
function installAppBridge() {
  const { apiKey, host } = state.config;
  const appBridge = createApp({
    apiKey,
    host,
  });

  return appBridge;
}
