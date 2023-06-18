import { Toast } from '@shopify/app-bridge/actions';
import { useAppBridge } from './main';

type ToastOption = {
  message: string;
  duration?: number;
  isError?: boolean;
};

export function useToast() {
  const appBridge = useAppBridge();

  const TOAST_DEFAULT_OPTIONS = {
    message: '',
    duration: 5000,
    isError: false,
  };

  const show = (options: ToastOption): void => {
    const toast = Toast.create(appBridge, {
      ...TOAST_DEFAULT_OPTIONS,
      ...options,
    });

    toast.dispatch(Toast.Action.SHOW);
  };

  return { show };
}
