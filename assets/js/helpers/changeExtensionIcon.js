/**
 * It changes the extension icon color.
 * Supported values are: 'red', 'white' and ''.
 */
export default function changeExtensionIcon(color = '') {

    if (color !== '') {
        color = '-' + color;
    }

    var path = './graphics/wakatime-logo-48' + color + '.png';

    chrome.browserAction.setIcon({
        path: path
    });
}
