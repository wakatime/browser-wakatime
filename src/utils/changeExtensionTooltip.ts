import {browser} from 'webextension-polyfill-ts';
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

    await browser.browserAction.setTitle({title: text});
}
