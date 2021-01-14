/* global browser */

var config = require('../config');

/**
 * It changes the extension title
 *
 * @param text
 */
function changeExtensionTooltip(text) {
  if (text === '') {
    text = config.name;
  } else {
    text = config.name + ' - ' + text;
  }

  browser.browserAction.setTitle({ title: text });
}

module.exports = changeExtensionTooltip;
