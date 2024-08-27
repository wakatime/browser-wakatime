import browser from 'webextension-polyfill';
import config, { ExtensionStatus } from '../config/config';
import { IS_FIREFOX } from './operatingSystem';

type ColorIconTypes = 'gray' | 'red' | 'white' | '';

/**
 * Sets status of the extension.
 */
export async function changeExtensionStatus(status: ExtensionStatus): Promise<void> {
  switch (status) {
    case 'allGood':
      await changeExtensionIcon(config.colors.allGood);
      await changeExtensionTooltip(config.tooltips.allGood);
      break;
    case 'trackingDisabled':
      await changeExtensionIcon(config.colors.trackingDisabled);
      await changeExtensionTooltip(config.tooltips.trackingDisabled);
      break;
    case 'notSignedIn':
      await changeExtensionIcon(config.colors.notSignedIn);
      await changeExtensionTooltip(config.tooltips.notSignedIn);
      break;
    case 'ignored':
      await changeExtensionIcon(config.colors.trackingDisabled);
      await changeExtensionTooltip(config.tooltips.ignored);
      break;
    default:
      break;
  }
  await browser.storage.sync.set({ extensionStatus: status });
}

/**
 * Changes the extension icon color.
 */
export async function changeExtensionIcon(color?: ColorIconTypes): Promise<void> {
  let path;
  if (color) {
    path = `./graphics/wakatime-logo-38-${color}.png`;
  } else {
    const { theme } = await browser.storage.sync.get({
      theme: config.theme,
    });
    path =
      theme === config.theme
        ? './graphics/wakatime-logo-38.png'
        : './graphics/wakatime-logo-38-white.png';
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (IS_FIREFOX && browser.browserAction) {
    await browser.browserAction.setIcon({ path: path }); // Support for FF with manifest V2
  } else if ((browser.action as browser.Action.Static | undefined) !== undefined) {
    await browser.action.setIcon({ path: path }); // Support for Chrome with manifest V3
  }
}

/**
 * It changes the extension title
 *
 */
export default async function changeExtensionTooltip(text: string): Promise<void> {
  if (text === '') {
    text = config.name;
  } else {
    text = `${config.name} - ${text}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (IS_FIREFOX && browser.browserAction) {
    await browser.browserAction.setTitle({ title: text }); // Support for FF with manifest V2
  } else if ((browser.action as browser.Action.Static | undefined) !== undefined) {
    await browser.action.setTitle({ title: text }); // Support for Chrome with manifest V3
  }
}
