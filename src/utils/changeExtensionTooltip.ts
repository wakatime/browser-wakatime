import browser from 'webextension-polyfill';
import config from '../config/config';
import { IS_FIREFOX } from '.';

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
