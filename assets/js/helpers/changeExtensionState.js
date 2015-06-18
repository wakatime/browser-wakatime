var config = require('../config');

// Helpers
var changeExtensionIcon = require('./changeExtensionIcon');
var changeExtensionTooltip = require('./changeExtensionTooltip');
var in_array = require('./in_array');

/**
 * Sets the current state of the extension.
 *
 * @param state
 */
function changeExtensionState(state) {
    if (! in_array(state, config.states)) {
        throw new Error('Not a valid state!');
    }

    switch (state) {
        case 'allGood':
            changeExtensionIcon(config.colors.allGood);
            changeExtensionTooltip(config.tooltips.allGood);
            break;
        case 'notLogging':
            changeExtensionIcon(config.colors.notLogging);
            changeExtensionTooltip(config.tooltips.notLogging);
            break;
        case 'notSignedIn':
            changeExtensionIcon(config.colors.notSignedIn);
            changeExtensionTooltip(config.tooltips.notSignedIn);
            break;
        case 'blacklisted':
            changeExtensionIcon(config.colors.notLogging);
            changeExtensionTooltip(config.tooltips.blacklisted);
            break;
        case 'whitelisted':
            changeExtensionIcon(config.colors.notLogging);
            changeExtensionTooltip(config.tooltips.whitelisted);
            break;
    }
}

module.exports = changeExtensionState;