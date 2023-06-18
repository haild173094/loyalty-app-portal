import { TitleBar } from '@shopify/app-bridge/actions';

import { useAppBridge, useGenerateButtons } from '.';

interface ButtonConfig {
  label: string;
  options?: Record<string, any>;
  onAction?: () => void;
}

interface ButtonGroupConfig {
  label: string;
  buttons: ButtonConfig[];
}

interface TitleBarOption {
  title: string;
  breadcrumbs?: ButtonConfig;
  buttons?: {
    primary?: ButtonConfig;
    secondary?: (ButtonGroupConfig | ButtonConfig)[];
  }
}

export function useTitleBar(options: TitleBarOption) {
  const appBridge = useAppBridge();
  const { generateButton, generateButtonGroup } = useGenerateButtons();
  let primaryButton = null;
  let secondaryButtons: (ButtonGroupConfig | ButtonConfig)[] = [];
  let breadcrumbs = null as any;

  if (options.buttons?.primary) {
    primaryButton = generateButton(options.buttons.primary);
  }

  if (options.buttons?.secondary) {
    const secondary = options.buttons.secondary;

    secondaryButtons = secondary.map((item: ButtonConfig) => {
      const buttonGroup = item as ButtonGroupConfig;

      // Generate button group if has 'buttons'
      if (buttonGroup.buttons && buttonGroup.buttons.length > 0) {
        return generateButtonGroup(buttonGroup);
      }

      return generateButton(item as ButtonConfig);
    });
  }

  if (options.breadcrumbs) {
    breadcrumbs = generateButton(options.breadcrumbs);
  }

  TitleBar.create(appBridge, {
    title: options.title,
    breadcrumbs,
    buttons: {
      primary: primaryButton || undefined,
      secondary: secondaryButtons as any,
    },
  });
}
