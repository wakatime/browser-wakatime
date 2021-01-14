/* global browser */
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
      },
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
      },
    });

    return deferredObject.promise();
  }

  /**
   * Depending on various factors detects the current active tab URL or domain,
   * and sends it to WakaTime for logging.
   */
  recordHeartbeat() {
    browser.storage.sync
      .get({
        loggingEnabled: config.loggingEnabled,
        loggingStyle: config.loggingStyle,
        blacklist: '',
        whitelist: '',
      })
      .then((items) => {
        if (items.loggingEnabled === true) {
          changeExtensionState('allGood');

          browser.idle.queryState(config.detectionIntervalInSeconds).then((newState) => {
            if (newState === 'active') {
              // Get current tab URL.
              browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
                if (tabs.length == 0) return;

                var currentActiveTab = tabs[0];
                var debug = false;

                // If the current active tab has devtools open
                if (in_array(currentActiveTab.id, this.tabsWithDevtoolsOpen)) {
                  debug = true;
                }

                if (items.loggingStyle == 'blacklist') {
                  if (!contains(currentActiveTab.url, items.blacklist)) {
                    this.sendHeartbeat(
                      {
                        url: currentActiveTab.url,
                        project: null,
                      },
                      debug,
                    );
                  } else {
                    changeExtensionState('blacklisted');
                    console.log(currentActiveTab.url + ' is on a blacklist.');
                  }
                }

                if (items.loggingStyle == 'whitelist') {
                  var heartbeat = this.getHeartbeat(currentActiveTab.url, items.whitelist);
                  if (heartbeat.url) {
                    this.sendHeartbeat(heartbeat, debug);
                  } else {
                    changeExtensionState('whitelisted');
                    console.log(currentActiveTab.url + ' is not on a whitelist.');
                  }
                }
              });
            }
          });
        } else {
          changeExtensionState('notLogging');
        }
      });
  }

  /**
   * Creates an array from list using \n as delimiter
   * and checks if any element in list is contained in the url.
   * Also checks if element is assigned to a project using @@ as delimiter
   *
   * @param url
   * @param list
   * @returns {object}
   */
  getHeartbeat(url, list) {
    var projectIndicatorCharacters = '@@';

    var lines = list.split('\n');
    for (var i = 0; i < lines.length; i++) {
      // strip (http:// or https://) and trailing (`/` or `@@`)
      var cleanLine = lines[i]
        .trim()
        .replace(/(\/|@@)$/, '')
        .replace(/^(?:https?:\/\/)?/i, '');
      if (cleanLine === '') continue;

      var projectIndicatorIndex = cleanLine.lastIndexOf(projectIndicatorCharacters);
      var projectIndicatorExists = projectIndicatorIndex > -1;
      var projectName = null;
      var urlFromLine = cleanLine;
      if (projectIndicatorExists) {
        var start = projectIndicatorIndex + projectIndicatorCharacters.length;
        projectName = cleanLine.substring(start);
        urlFromLine = cleanLine
          .replace(cleanLine.substring(projectIndicatorIndex), '')
          .replace(/\/$/, '');
      }
      var schemaHttpExists = url.match(/^http:\/\//i);
      var schemaHttpsExists = url.match(/^https:\/\//i);
      var schema = '';
      if (schemaHttpExists) {
        schema = 'http://';
      }
      if (schemaHttpsExists) {
        schema = 'https://';
      }
      var cleanUrl = url
        .trim()
        .replace(/(\/|@@)$/, '')
        .replace(/^(?:https?:\/\/)?/i, '');
      var startsWithUrl = cleanUrl.toLowerCase().indexOf(urlFromLine.toLowerCase()) > -1;
      if (startsWithUrl) {
        return {
          url: schema + urlFromLine,
          project: projectName,
        };
      }
    }

    return {
      url: null,
      project: null,
    };
  }

  /**
   * Creates payload for the heartbeat and returns it as JSON.
   *
   * @param heartbeat
   * @param type
   * @param debug
   * @returns {*}
   * @private
   */
  _preparePayload(heartbeat, type, debug = false) {
    return JSON.stringify({
      entity: heartbeat.url,
      type: type,
      time: moment().format('X'),
      project: heartbeat.project || '<<LAST_PROJECT>>',
      is_debugging: debug,
      plugin: 'browser-wakatime/' + config.version,
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

    browser.storage.sync
      .get({
        loggingType: config.loggingType,
      })
      .then(function (items) {
        deferredObject.resolve(items.loggingType);
      });

    return deferredObject.promise();
  }

  /**
   * Given the heartbeat and logging type it creates a payload and
   * sends an ajax post request to the API.
   *
   * @param heartbeat
   * @param debug
   */
  sendHeartbeat(heartbeat, debug) {
    var payload = null;

    this._getLoggingType().done((loggingType) => {
      // Get only the domain from the entity.
      // And send that in heartbeat
      if (loggingType == 'domain') {
        heartbeat.url = getDomainFromUrl(heartbeat.url);
        payload = this._preparePayload(heartbeat, 'domain', debug);
        console.log(payload);
        this.sendAjaxRequestToApi(payload);
      }
      // Send entity in heartbeat
      else if (loggingType == 'url') {
        payload = this._preparePayload(heartbeat, 'url', debug);
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
        },
      },
      success: (response) => {
        deferredObject.resolve(this);
      },
      error: (xhr, status, err) => {
        console.error(config.heartbeatApiUrl, status, err.toString());

        deferredObject.resolve(this);
      },
    });

    return deferredObject.promise();
  }
}

export default WakaTimeCore;
