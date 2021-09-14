import {browser} from 'webextension-polyfill-ts';
import config from '../config/config';

type ColorIconTypes = 'gray' | 'red' | 'white' | '';

/**
 * It changes the extension icon color.
 */
export default async function changeExtensionIcon(color?: ColorIconTypes): Promise<void> {
    if (color) {
        const path = `./graphics/wakatime-logo-38-${color}.png`;

        await browser.browserAction.setIcon({
            path: path,
        });
    } else {
        const {theme} = await browser.storage.sync.get({
            theme: config.theme,
        });
        const path =
            theme === config.theme
                ? './graphics/wakatime-logo-38.png'
                : './graphics/wakatime-logo-38-white.png';
        await browser.browserAction.setIcon({
            path: path,
        });
    }
}
