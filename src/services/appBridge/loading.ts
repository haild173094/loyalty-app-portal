import { Loading } from '@shopify/app-bridge/actions';
import { useAppBridge } from './main';

export function useLoading() {
  const appBridge = useAppBridge();

  const loading = Loading.create(appBridge);

  const start = (): void => {
    loading.dispatch(Loading.Action.START);
  };

  const stop = (): void => {
    loading.dispatch(Loading.Action.STOP);
  };

  return {
    start,
    stop,
  };
}
