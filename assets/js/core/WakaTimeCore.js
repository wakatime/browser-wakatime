/* global chrome */
//jshint esnext:true

var $ = require('jquery');
var moment = require('moment');

var config = require('./../config');

// Helpers
var getDomainFromUrl = require('./../helpers/getDomainFromUrl');
var changeExtensionState = require('../helpers/changeExtensionState');
var in_array = require('./../helpers/in_array');
var contains = require('./../helpers/contains');

class WakaTimeCore {

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

    getTotalTimeLoggedToday() {
        var deferredObject = $.Deferred();

        var today = moment().format('YYYY-MM-DD');

        $.ajax({
            url: config.summariesApiUrl + '?start=' + today + '&end=' + today,
            dataType: 'json',
            success: (data) => {

                deferredObject.resolve(data.data[0].grand_total);

            },
            error: (xhr, status, err) => {

                console.error(config.summariesApiUrl, status, err.toString());

                deferredObject.resolve(false);
            }
        });

        return deferredObject.promise();
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

        chrome.storage.sync.get({
            loggingEnabled: config.loggingEnabled,
            loggingStyle: config.loggingStyle,
            blacklist: '',
            whitelist: ''
        }, (items) => {
            if (items.loggingEnabled === true) {

                changeExtensionState('allGood');

                chrome.idle.queryState(config.detectionIntervalInSeconds, (newState) => {

                    if (newState === 'active') {
                        // Get current tab URL.
                        chrome.tabs.query({active: true}, (tabs) => {

                            var currentActiveTab = tabs[0];

                            var debug = false;
                            // If the current active tab has devtools open
                            if (in_array(currentActiveTab.id, this.tabsWithDevtoolsOpen)) debug = true;

                            if (items.loggingStyle == 'blacklist') {
                                if (! contains(currentActiveTab.url, items.blacklist)) {
                                    this.sendHeartbeat(currentActiveTab.url, debug);
                                }
                                else {
                                    changeExtensionState('blacklisted');
                                    console.log(currentActiveTab.url + ' is on a blacklist.');
                                }
                            }

                            if (items.loggingStyle == 'whitelist') {
                                if (contains(currentActiveTab.url, items.whitelist)) {
                                    this.sendHeartbeat(currentActiveTab.url, debug);
                                }
                                else {
                                    changeExtensionState('whitelisted');
                                    console.log(currentActiveTab.url + ' is not on a whitelist.');
                                }
                            }

                        });
                    }
                });
            }
            else {
                changeExtensionState('notLogging');
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
            time: moment().format('X'),
            project: '<<LAST_PROJECT>>',
            is_debugging: debug,
            plugin: 'chrome-wakatime/' + config.version
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
            statusCode: {
                401: function () {
                    changeExtensionState('notSignedIn');
                },
                201: function () {
                    // nothing to do here
                }
            },
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

export default WakaTimeCore;
