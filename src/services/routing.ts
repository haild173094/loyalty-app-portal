import { useRouter } from 'vue-router';

export const useRoutingService = () => {
  const router = useRouter();
  const routes = router.getRoutes();

  /**
   * Get route path by route object.
   * @param routeObject {name: 'settings', params: { id: '1' }, query: { keyword: 'test' }}
   * @returns string '/settings/1?keyword=test'
   */
  const getRoutePathByRouteObject = (routeObject: Record<string, any>): string => router.resolve(routeObject).fullPath;

  /**
   * Get route path by name from router config.
   * @param name 'dashboard'
   * @returns string '/dashboard/'
   */
  const getRoutePathByName = (name: string): string => getRoutePathByRouteObject({ name });

  /**
   * Get name from the route config by path url.
   * @param path '/dashboard/'
   * @returns string 'dashboard'
   */
  const getRouteNameByPath = (path: string, fallBackRoute = 'dashboard'): string => {
    const matchedRoute = routes.find(record => record.path === path);

    return matchedRoute ? String(matchedRoute.name) : fallBackRoute;
  };

  return {
    getRoutePathByRouteObject,
    getRoutePathByName,
    getRouteNameByPath,
  };
};
