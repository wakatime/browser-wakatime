var UrlHelper = require('./UrlHelper');

var $ = require('jquery');

var currentTimestamp = require('./helpers/currentTimestamp');

class WakaTime {

    detectionIntervalInSeconds = 60; //default

    loggingType = 'domain'; //default

    heartbeatApiUrl = 'https://wakatime.com/api/v1/users/current/heartbeats';

    recordHeartbeat()
    {
        console.log('recording heartbeat.');

        chrome.idle.queryState(this.detectionIntervalInSeconds, (newState) => {

            console.log(newState);

            if(newState === 'active')
            {
                // Get current tab URL.
                chrome.tabs.query({active: true}, (tabs) => {
                    console.log(tabs[0].url);

                    this.sendHeartbeat(tabs[0].url);
                });
            }
        })
    }

    _preparePayload(entity, type, debug = false)
    {
        return {
            entity: entity,
            type: type,
            time: currentTimestamp(),
            is_debugging: debug
        };
    }

    _getLoggingType()
    {
        var deferredObject = $.Deferred();

        chrome.storage.sync.get({
            loggingType: this.loggingType
        }, function(items) {
            deferredObject.resolve(items.loggingType);
        });

        return deferredObject.promise();
    }

    sendHeartbeat(entity)
    {
        this._getLoggingType().done((loggingType) => {

            if(loggingType == 'domain') {
                console.log('sending entity with type domain');

                // Get only the domain from the entity.
                // And send that in heartbeat
                console.log(UrlHelper.getDomainFromUrl(entity));

                var domain = UrlHelper.getDomainFromUrl(entity);

                var payload = this._preparePayload(domain, 'domain');

                console.log(payload);

                this.sendAjaxRequestToApi(payload);

            }
            else if (loggingType == 'url') {
                console.log('sending entity with type url');

                // Send entity in heartbeat

                var payload = this._preparePayload(entity, 'url');

                console.log(payload);

                this.sendAjaxRequestToApi(payload);
            }

        });
    }

    sendAjaxRequestToApi(payload, method = 'POST') {

        var deferredObject = $.Deferred();

        $.ajax({
            url: this.heartbeatApiUrl,
            dataType: 'json',
            method: method,
            data: payload,
            success: (response) =>  {

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
