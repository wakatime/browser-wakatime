import UrlHelper from './UrlHelper.js';
import $ from 'jquery';
import currentTimestamp from './helpers/currentTimestamp.js';
import changeExtensionIcon from './helpers/changeExtensionIcon.js';
import devtools from './libs/devtools-detect.js';

class WakaTime {

    detectionIntervalInSeconds = 60; //default

    loggingType = 'domain'; //default

    heartbeatApiUrl = 'https://wakatime.com/api/v1/users/current/heartbeats';

    currentUserApiUrl = 'https://wakatime.com/api/v1/users/current';

    /**
     * Checks if the user is logged in.
     *
     * @returns {*}
     */
    checkAuth() {
        var deferredObject = $.Deferred();

        $.ajax({
            url: this.currentUserApiUrl,
            dataType: 'json',
            success: (data) => {

                deferredObject.resolve(data.data);

            },
            error: (xhr, status, err) => {

                console.error(this.currentUserApiUrl, status, err.toString());

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
                    loggingEnabled: true
                }, (items) => {
                    if (items.loggingEnabled === true) {
                        changeExtensionIcon();

                        chrome.idle.queryState(this.detectionIntervalInSeconds, (newState) => {

                            if (newState === 'active') {
                                // Get current tab URL.
                                chrome.tabs.query({active: true}, (tabs) => {
                                    this.sendHeartbeat(tabs[0].url);
                                });
                            }
                        });
                    }
                    else {
                        changeExtensionIcon('red');
                    }
                });
            }
            else {

                // User is not logged in.
                // Change extension icon to red color.
                changeExtensionIcon('red');
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
            loggingType: this.loggingType
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
     */
    sendHeartbeat(entity) {

        var payload = null;

        // TODO: Detect if devTools are open
        console.log(devtools.open);

        this._getLoggingType().done((loggingType) => {

            // Get only the domain from the entity.
            // And send that in heartbeat
            if (loggingType == 'domain') {

                var domain = UrlHelper.getDomainFromUrl(entity);

                payload = this._preparePayload(domain, 'domain');

                console.log(payload);

                this.sendAjaxRequestToApi(payload);

            }
            // Send entity in heartbeat
            else if (loggingType == 'url') {
                payload = this._preparePayload(entity, 'url');

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
            url: this.heartbeatApiUrl,
            dataType: 'json',
            contentType: 'application/json',
            method: method,
            data: payload,
            success: (response) => {

                deferredObject.resolve(this);

            },
            error: (xhr, status, err) => {

                console.error(this.heartbeatApiUrl, status, err.toString());

                deferredObject.resolve(this);

            }
        });

        return deferredObject.promise();
    }

}

export default WakaTime;
