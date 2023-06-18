import {
  Button,
  ButtonGroup,
} from '@shopify/app-bridge/actions';
import { useAppBridge } from './main';

interface ButtonConfig {
  label: string;
  options?: Record<string, any>;
  onAction?: () => void;
}

interface ButtonGroupConfig {
  label: string;
  buttons: ButtonConfig[];
}

export function useGenerateButtons() {
  const appBridge = useAppBridge();

  const generateButton = (buttonConfig: ButtonConfig) => {
    const buttonElm = Button.create(appBridge, {
      label: buttonConfig.label,
      ...buttonConfig.options,
    });

    if (buttonConfig.onAction) {
      buttonElm.subscribe(Button.Action.CLICK, buttonConfig.onAction);
    }

    return buttonElm;
  };

  const generateButtonGroup = (buttonGroup: ButtonGroupConfig) => {
    const buttonGroupElm = ButtonGroup.create(appBridge, {
      label: buttonGroup.label,
      buttons: buttonGroup.buttons.map((button: ButtonConfig) => generateButton(button)),
    });

    return buttonGroupElm;
  };

  return {
    generateButton,
    generateButtonGroup,
  };
}
