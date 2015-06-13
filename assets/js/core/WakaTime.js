var $ = require('jquery');

var config = require('./../config');

// Helpers
var getDomainFromUrl = require('./../helpers/getDomainFromUrl');
var currentTimestamp = require('./../helpers/currentTimestamp');
var changeExtensionState = require('../helpers/changeExtensionState');
var in_array = require('./../helpers/in_array');

class WakaTime {

    constructor() {
        this.tabsWithDevtoolsOpen = [];
    }

    /**
     * Settter for tabsWithDevtoolsOpen
     *
     * @param tabs
     */
    setTabsWithDevtoolsOpen(tabs) {
        this.tabsWithDevtoolsOpen = tabs;
    }

    /**
     * Checks if the user is logged in.
     *
     * @returns {*}
     */
    checkAuth() {
        var deferredObject = $.Deferred();

        $.ajax({
            url: config.currentUserApiUrl,
            dataType: 'json',
            success: (data) => {

                deferredObject.resolve(data.data);

            },
            error: (xhr, status, err) => {

                console.error(config.currentUserApiUrl, status, err.toString());

                deferredObject.resolve(false);
            }
        });

        return deferredObject.promise();
    }

    /**
     * Depending on various factors detects the current active tab URL or domain,
     * and sends it to WakaTime for logging.
     */
    recordHeartbeat() {
        this.checkAuth().done(data => {

            if (data !== false) {

                chrome.storage.sync.get({
                    loggingEnabled: config.loggingEnabled
                }, (items) => {
                    if (items.loggingEnabled === true) {

                        changeExtensionState('allGood');

                        chrome.idle.queryState(config.detectionIntervalInSeconds, (newState) => {

                            if (newState === 'active') {
                                // Get current tab URL.
                                chrome.tabs.query({active: true}, (tabs) => {
                                    var debug = false;
                                    // If the current active tab has devtools open
                                    if (in_array(tabs[0].id, this.tabsWithDevtoolsOpen)) debug = true;

                                    this.sendHeartbeat(tabs[0].url, debug);
                                });
                            }
                        });
                    }
                    else {
                        changeExtensionState('notLogging');
                    }
                });
            }
            else {

                // User is not logged in.
                // Change extension icon to red color.
                changeExtensionState('notSignedIn');
            }
        });
    }

    /**
     * Creates payload for the heartbeat and returns it as JSON.
     *
     * @param entity
     * @param type
     * @param debug
     * @returns {*}
     * @private
     */
    _preparePayload(entity, type, debug = false) {
        return JSON.stringify({
            entity: entity,
            type: type,
            time: currentTimestamp(),
            is_debugging: debug
        });
    }


    /**
     * Returns a promise with logging type variable.
     *
     * @returns {*}
     * @private
     */
    _getLoggingType() {
        var deferredObject = $.Deferred();

        chrome.storage.sync.get({
            loggingType: config.loggingType
        }, function (items) {
            deferredObject.resolve(items.loggingType);
        });

        return deferredObject.promise();
    }

    /**
     * Given the entity and logging type it creates a payload and
     * sends an ajax post request to the API.
     *
     * @param entity
     * @param debug
     */
    sendHeartbeat(entity, debug) {

        var payload = null;

        this._getLoggingType().done((loggingType) => {

            // Get only the domain from the entity.
            // And send that in heartbeat
            if (loggingType == 'domain') {

                var domain = getDomainFromUrl(entity);

                payload = this._preparePayload(domain, 'domain', debug);

                console.log(payload);

                this.sendAjaxRequestToApi(payload);

            }
            // Send entity in heartbeat
            else if (loggingType == 'url') {
                payload = this._preparePayload(entity, 'url', debug);

                console.log(payload);

                this.sendAjaxRequestToApi(payload);
            }

        });
    }

    /**
     * Sends AJAX request with payload to the heartbeat API as JSON.
     *
     * @param payload
     * @param method
     * @returns {*}
     */
    sendAjaxRequestToApi(payload, method = 'POST') {

        var deferredObject = $.Deferred();

        $.ajax({
            url: config.heartbeatApiUrl,
            dataType: 'json',
            contentType: 'application/json',
            method: method,
            data: payload,
            success: (response) => {

                deferredObject.resolve(this);

            },
            error: (xhr, status, err) => {

                console.error(config.heartbeatApiUrl, status, err.toString());

                deferredObject.resolve(this);

            }
        });

        return deferredObject.promise();
    }

}

export default WakaTime;
