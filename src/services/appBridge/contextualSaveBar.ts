import { ContextualSaveBar } from '@shopify/app-bridge/actions';
import { useAppBridge } from './main';

interface ContextualSaveBarOption {
  fullWidth?: boolean;
  leaveConfirmationDisable?: boolean;
  visible?: boolean;
  saveAction?: {
    disabled?: boolean;
    loading?: boolean;
  },
  discardAction?: {
    disabled?: boolean;
    loading?: boolean;
    discardConfirmationModal?: boolean;
  }
}

export function useContextualSaveBar() {
  const appBridge = useAppBridge();

  const CONTEXTUAL_SAVE_BAR_DEFAULT_OPTIONS = {
    fullWidth: true,
    leaveConfirmationDisable: true,
    saveAction: {
      disabled: false,
      loading: false,
    },
    discardAction: {
      disabled: false,
      loading: false,
      discardConfirmationModal: true,
    },
  };

  const contextualSaveBar = ContextualSaveBar.create(appBridge, CONTEXTUAL_SAVE_BAR_DEFAULT_OPTIONS);

  const config = (options: ContextualSaveBarOption) => {
    contextualSaveBar.set(options);
  };

  const onSave = (callBack: () => void): void => {
    contextualSaveBar.subscribe(
      ContextualSaveBar.Action.SAVE,
      () => {
        callBack();
      },
    );
  };
  const onDiscard = (callBack: () => void): void => {
    contextualSaveBar.subscribe(
      ContextualSaveBar.Action.DISCARD,
      () => {
        callBack();
      },
    );
  };
  const show = (): void => {
    contextualSaveBar.dispatch(ContextualSaveBar.Action.SHOW);
  };
  const hide = (): void => {
    contextualSaveBar.dispatch(ContextualSaveBar.Action.HIDE);
  };
  const unsubscribe = (): void => {
    contextualSaveBar.unsubscribe();
  };

  return {
    config,
    show,
    hide,
    unsubscribe,
    onSave,
    onDiscard,
  };
}
