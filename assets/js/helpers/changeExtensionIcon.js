/**
 * It changes the extension icon color.
 * Supported values are: 'red', 'white' and ''.
 *
 * @param  string color = ''
 * @return null
 */
export default function changeExtensionIcon(color = '') {

    if(color !== ''){
        color = '-' + color;
    }

    var path = './graphics/wakatime-logo-48' + color + '.png';

    chrome.browserAction.setIcon({
        path: path
    });
}
