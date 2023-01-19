import browser from 'webextension-polyfill';
import config from '../config/config';

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

  await browser.action.setTitle({ title: text });
}
