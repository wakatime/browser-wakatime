/* global chrome */

var config = require('../config');

/**
 * It changes the extension icon color.
 * Supported values are: 'red', 'white', 'gray' and ''.
 *
 * @param color
 */
function changeExtensionIcon(color) {

    color = color ? color : '';

    var path = null;

    if (color !== '') {
        color = '-' + color;

        path = './graphics/wakatime-logo-38' + color + '.png';

        chrome.browserAction.setIcon({
            path: path
        });
    }

    if (color === '') {
        chrome.storage.sync.get({
            theme: config.theme
        }, function (items) {
            if (items.theme == config.theme) {
                path = './graphics/wakatime-logo-38.png';

                chrome.browserAction.setIcon({
                    path: path
                });
            }
            else {
                path = './graphics/wakatime-logo-38-white.png';

                chrome.browserAction.setIcon({
                    path: path
                });
            }
        });
    }

}

module.exports = changeExtensionIcon;
