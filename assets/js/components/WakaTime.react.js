//jshint esnext:true

var React = require("react");
var $ = require('jquery');

var config = require('../config');

// React components
var NavBar = require('./NavBar.react');
var MainList = require('./MainList.react');

// Core
var WakaTimeOriginal = require('../core/WakaTime');

// Helpers
var changeExtensionState = require('../helpers/changeExtensionState');

class WakaTime extends React.Component {

    constructor(){

        super();

        this.state = {
            user: {
                full_name: null,
                email: null,
                photo: null
            },
            loggedIn: false,
            loggingEnabled: config.loggingEnabled
        };
    }


    componentDidMount() {

        var wakatime = new WakaTimeOriginal;

        wakatime.checkAuth().done(data => {

            if (data !== false) {

                chrome.storage.sync.get({
                    loggingEnabled: config.loggingEnabled
                }, (items) => {
                    this.setState({loggingEnabled: items.loggingEnabled});
                    if (items.loggingEnabled === true) {
                        changeExtensionState('allGood');
                    }
                    else {
                        changeExtensionState('notLogging');
                    }
                });

                this.setState({
                    user: {
                        full_name: data.full_name,
                        email: data.email,
                        photo: data.photo
                    },
                    loggedIn: true
                });
            }
            else {
                changeExtensionState('notSignedIn');
            }
        });

    }

    logoutUser() {
        var deferredObject = $.Deferred();

        $.ajax({
            url: config.logoutUserUrl,
            method: 'GET',
            success: () => {

                deferredObject.resolve(this);

            },
            error: (xhr, status, err) => {

                console.error(config.logoutUserUrl, status, err.toString());

                deferredObject.resolve(this);
            }
        });

        return deferredObject.promise();
    }

    _logoutUser() {
        this.logoutUser().done(() => {

            this.setState({
                user: {
                    full_name: null,
                    email: null,
                    photo: null
                },
                loggedIn: false,
                loggingEnabled: false
            });

            changeExtensionState('notSignedIn');

        });
    }

    _disableLogging() {
        this.setState({
            loggingEnabled: false
        });

        changeExtensionState('notLogging');

        chrome.storage.sync.set({
            loggingEnabled: false
        });
    }

    _enableLogging() {
        this.setState({
            loggingEnabled: true
        });

        changeExtensionState('allGood');

        chrome.storage.sync.set({
            loggingEnabled: true
        });
    }

    render() {
        return (
            <div>
                <NavBar />
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <MainList
                                disableLogging={this._disableLogging.bind(this)}
                                enableLogging={this._enableLogging.bind(this)}
                                loggingEnabled={this.state.loggingEnabled}
                                user={this.state.user}
                                logoutUser={this._logoutUser.bind(this)}
                                loggedIn={this.state.loggedIn} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default WakaTime;
