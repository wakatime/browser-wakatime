import browser from 'webextension-polyfill';
import config from '../config/config';
import { IS_FIREFOX } from '.';

type ColorIconTypes = 'gray' | 'red' | 'white' | '';

/**
 * It changes the extension icon color.
 */
export default async function changeExtensionIcon(color?: ColorIconTypes): Promise<void> {
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
