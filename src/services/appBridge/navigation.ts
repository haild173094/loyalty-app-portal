import { provide } from 'vue';
import {
  Redirect,
  NavigationMenu,
  AppLink,
} from '@shopify/app-bridge/actions';
import { useAppBridge } from './main';

export function useNavigation() {
  const appBridge = useAppBridge();

  const navigate = (path: string): void => {
    const shopifyRedirect = Redirect.create(appBridge);

    shopifyRedirect.dispatch(Redirect.Action.APP, path);
  };

  const redirectExternal = (path: string, options?: Record<string, any>) => {
    const shopifyRedirect = Redirect.create(appBridge);

    shopifyRedirect.dispatch(Redirect.Action.REMOTE, {
      url: path,
      ...options,
    });
  };

  // Install navigation side bar
  const setNavigation = (navigationItems: Record<string, string>[]) => {
    console.log(1, navigationItems);
    if (navigationItems && navigationItems.length > 0) {
      NavigationMenu.create(appBridge, {
        items: navigationItems.map(item =>
          AppLink.create(appBridge, {
            label: item.label,
            destination: item.destination,
          }),
        ),
      });
    }
  };

  provide('redirectExternal', redirectExternal);

  return {
    navigate,
    redirectExternal,
    setNavigation,
  };
}
