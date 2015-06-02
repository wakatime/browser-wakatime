(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// What to do when the event page first loads?
//
// Functional style
//
// 1. Run a function every 2 mins DONE
// 2. Check if the user is active (not idle)
// If the user is active, get the current active tab URL
// and send heartbeat to wakatime.
//

'use strict';

var WakaTime = require('./WakaTime');

/**
 * Whenever an alarms sets off, this function
 * gets called to detect the alarm name and
 * do appropriate action.
 *
 * @param alarm
 */
function resolveAlarm(alarm) {
    // |alarm| can be undefined because onAlarm also gets called from
    // window.setTimeout on old chrome versions.
    if (alarm && alarm.name == 'heartbeatAlarm') {

        console.log('heartbeatAlarm triggered');

        var wakatime = new WakaTime();

        wakatime.recordHeartbeat();
    }
}

// Add a listener to resolve alarms
chrome.alarms.onAlarm.addListener(resolveAlarm);

// Create a new alarm for heartbeats.
chrome.alarms.create('heartbeatAlarm', { periodInMinutes: 1 });

},{"./WakaTime":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UrlHelper = (function () {
    function UrlHelper() {
        _classCallCheck(this, UrlHelper);
    }

    _createClass(UrlHelper, null, [{
        key: "getDomainFromUrl",
        value: function getDomainFromUrl(url) {
            var parts = url.split("/");

            return parts[0] + "//" + parts[2];
        }
    }]);

    return UrlHelper;
})();

exports["default"] = UrlHelper;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var UrlHelper = require('./UrlHelper');

var currentTimestamp = require('./helpers/currentTimestamp');

var WakaTime = (function () {
    function WakaTime() {
        _classCallCheck(this, WakaTime);

        this.detectionIntervalInSeconds = 60;
        this.loggingType = 'domain';
    }

    _createClass(WakaTime, [{
        key: 'recordHeartbeat',
        //default

        value: function recordHeartbeat() {
            var _this = this;

            console.log('recording heartbeat.');

            chrome.idle.queryState(this.detectionIntervalInSeconds, function (newState) {

                console.log(newState);

                if (newState === 'active') {
                    // Get current tab URL.
                    chrome.tabs.query({ active: true }, function (tabs) {
                        console.log(tabs[0].url);

                        _this.sendHeartbeat(tabs[0].url);
                    });
                }
            });
        }
    }, {
        key: 'sendHeartbeat',
        value: function sendHeartbeat(entity) {
            chrome.storage.sync.get({
                loggingType: this.loggingType
            }, function (items) {

                if (items.loggingType == 'domain') {
                    console.log('sending entity with type domain');

                    // Get only the domain from the entity.
                    // And send that in heartbeat
                    console.log(UrlHelper.getDomainFromUrl(entity));

                    var domain = UrlHelper.getDomainFromUrl(entity);

                    var data = {
                        entity: domain,
                        type: 'domain',
                        time: currentTimestamp(),
                        is_debugging: false
                    };

                    console.log(data);
                } else if (items.loggingType == 'url') {
                    console.log('sending entity with type url');

                    // Send entity in heartbeat

                    var data = {
                        entity: entity,
                        type: 'url',
                        time: currentTimestamp(),
                        is_debugging: false
                    };

                    console.log(data);
                }
            });
        }
    }]);

    return WakaTime;
})();

exports['default'] = WakaTime;
module.exports = exports['default'];
//default

},{"./UrlHelper":2,"./helpers/currentTimestamp":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports["default"] = function () {
    return Math.round(new Date().getTime() / 1000);
};

module.exports = exports["default"];

},{}]},{},[1]);
