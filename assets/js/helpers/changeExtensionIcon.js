/**
 * It changes the extension icon color.
 * Supported values are: 'red', 'white' and ''.
 */
export default function changeExtensionIcon(color = '') {

    var path = null;

    if (color !== '') {
        color = '-' + color;

        path = './graphics/wakatime-logo-48' + color + '.png';

        chrome.browserAction.setIcon({
            path: path
        });
    }

    if (color === '') {
        chrome.storage.sync.get({
            theme: 'light'
        }, function (items) {
            if (items.theme == 'light') {
                path = './graphics/wakatime-logo-48.png';

                chrome.browserAction.setIcon({
                    path: path
                });
            }
            else {
                path = './graphics/wakatime-logo-48-white.png';

                chrome.browserAction.setIcon({
                    path: path
                });
            }
        });
    }

}
