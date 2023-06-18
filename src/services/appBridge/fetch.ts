import { authenticatedFetch } from '@shopify/app-bridge-utils';
import { APP_CONFIG, APP_LIST } from '@/configs/common';
import { useAppBridge } from './main';
import { APP_BRIDGE_FETCH_CONFIG } from '@/configs/appBridge';
import { useNavigation } from './navigation';

const { redirectExternal } = useNavigation();

// Definitions
export interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

export interface AppBridgeFetchConfig {
  apiURL: string;
  appSlug: string;
}

interface State {
  config: AppBridgeFetchConfig;
  fetchFunction: ReturnType<typeof authenticatedFetch> | null;
}

// fetchFunction instance state
const state: State = {
  config: APP_BRIDGE_FETCH_CONFIG,
  fetchFunction: null,
};

// Required headers for Backend requests
const requiredHeaders = {
  'Qikify-App': state.config.appSlug,
  Embed: 'true',
};

export function useAuthenticatedFetch() {
  // Create instance if has not been initialized
  if (!state.fetchFunction) {
    const appBridge = useAppBridge();

    state.fetchFunction = authenticatedFetch(appBridge);
  }

  // Main Fetch function
  const fetch = async (uri: RequestInfo, options?: FetchOptions) => {
    if (!state.fetchFunction) {
      throw new Error('Fetch Function is not available.');
    }

    const { apiURL } = state.config;
    let modifiedUri = uri;

    // Prepend base url if input is a path (eg. /my-store/1234) and not an HTTP link
    // else leave as is
    if (!(modifiedUri as string).startsWith('http')) {
      modifiedUri = !(modifiedUri as string).startsWith('/') ? `/${modifiedUri}` : modifiedUri;
      modifiedUri = apiURL + modifiedUri;
    }

    // Add query strings
    if (options && options.params) {
      Object.keys(options.params).forEach(key => {
        if (options.params && options.params[key] === undefined) {
          delete options.params[key];
        }
      });

      modifiedUri = `${modifiedUri}?${new URLSearchParams(options?.params)}`;
    }

    const additionalHeaders: Record<string, any> = {};

    // Determine content type headers
    //    if instance of FormData: Fetch API handles automatically
    //    else:
    //        set 'Content-Type' = 'application/json'
    //        set JSON.stringify() on request.body
    if (options?.body && !(options.body instanceof FormData)) {
      options.body = JSON.stringify(options?.body);
      additionalHeaders['Content-Type'] = 'application/json';
    }

    // Combine headers
    const headers = {
      ...requiredHeaders,
      ...additionalHeaders,
      ...options?.headers,
    };

    try {
      const res = await state.fetchFunction(modifiedUri, {
        ...options,
        headers,
      });

      return responseInterceptor(res);
    } catch (error) {
      console.log(error);
    }
  };

  const responseInterceptor = async (response: Response): Promise<any> => {
    const contentType = response.headers.get('content-type');
    const isJsonType: boolean = contentType ? contentType.indexOf('application/json') !== -1 : true;

    // Case status code 204: response has no content
    if (response.status === 204) {
      return Promise.resolve();
    }

    let parsedResponse = response;

    if (isJsonType) {
      parsedResponse = await response.json();
    }

    if (response.status >= 400) {
      const { status } = response;

      // Redirecting to authorization flow to update app
      if (status === 403 && json.code === 'UPDATE_REQUIRED') {
        const {
          embeddedUrl,
          appSlug,
          shopDomainName,
        } = APP_CONFIG;

        return redirectExternal(`${embeddedUrl}/${appSlug}?shop=${shopDomainName}`);
      }

      if (status === 401) {
        const { origin, pathname } = window.location;
        const app = pathname.split('/')[1] || '';

        window.location.href = APP_LIST.includes(app) ? `${origin}/${app}?path=logout` : '/';
      }

      const errorResponse = {
        status_code: response.status,
        ...parsedResponse,
      };

      return Promise.reject(errorResponse);
    }

    return parsedResponse;
  };

  // Expose methods
  const _fetch = (uri: RequestInfo, options?: Record<string, any>) => {
    const { body, ...rest } = options || {};

    return fetch(uri, {
      ...rest,
      body,
    });
  };

  const _get = (uri: RequestInfo, options?: FetchOptions) => fetch(uri, {
    ...options,
    method: 'GET',
  });

  const _post = (uri: RequestInfo, data?: any, options?: FetchOptions) => fetch(uri, {
    ...options,
    body: data,
    method: 'POST',
  });

  const _put = (uri: RequestInfo, data?: any, options?: FetchOptions) => fetch(uri, {
    ...options,
    body: data,
    method: 'PUT',
  });

  const _patch = (uri: RequestInfo, data?: any, options?: FetchOptions) => fetch(uri, {
    ...options,
    body: data,
    method: 'PATCH',
  });

  const _delete = (uri: RequestInfo, options?: FetchOptions) => fetch(uri, {
    ...options,
    method: 'DELETE',
  });

  return {
    fetch: _fetch,
    get: _get,
    post: _post,
    put: _put,
    patch: _patch,
    delete: _delete,
  };
}

