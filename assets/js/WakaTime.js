var UrlHelper = require('./UrlHelper');

var currentTimestamp = require('./helpers/currentTimestamp');

class WakaTime {

    detectionIntervalInSeconds = 60; //default

    loggingType = 'domain'; //default

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

    sendHeartbeat(entity)
    {
        chrome.storage.sync.get({
            loggingType: this.loggingType
        }, function(items) {

            if(items.loggingType == 'domain') {
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


            }
            else if (items.loggingType == 'url') {
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

}

export default WakaTime;
