/* global chrome */

var React = require("react");
var $ = require('jquery');

var config = require('../config');

// React components
var NavBar = require('./NavBar.jsx');
var MainList = require('./MainList.jsx');

// Core
var WakaTimeCore = require('../core/WakaTimeCore').default;

// Helpers
var changeExtensionState = require('../helpers/changeExtensionState');

var Wakatime = React.createClass({

    getInitialState: function() {
        return {
            user: {
                full_name: null,
                email: null,
                photo: null
            },
            loggedIn: false,
            loggingEnabled: config.loggingEnabled,
            totalTimeLoggedToday: '0 minutes'
        };
    },

    componentDidMount: function() {

        var wakatime = new WakaTimeCore();

        var that = this;

        wakatime.checkAuth().done(function(data) {

            if (data !== false) {

                chrome.storage.sync.get({
                    loggingEnabled: config.loggingEnabled
                }, function(items) {
                    that.setState({loggingEnabled: items.loggingEnabled});

                    if (items.loggingEnabled === true) {
                        changeExtensionState('allGood');
                    }
                    else {
                        changeExtensionState('notLogging');
                    }
                });

                that.setState({
                    user: {
                        full_name: data.full_name,
                        email: data.email,
                        photo: data.photo
                    },
                    loggedIn: true
                });

                wakatime.getTotalTimeLoggedToday().done(function(grand_total) {
                    that.setState({
                        totalTimeLoggedToday: grand_total.text
                    });
                });
            }
            else {
                changeExtensionState('notSignedIn');
            }
        });

    },

    logoutUser: function() {
        var deferredObject = $.Deferred();

        var that = this;

        $.ajax({
            url: config.logoutUserUrl,
            method: 'GET',
            success: function() {

                deferredObject.resolve(that);

            },
            error: function(xhr, status, err) {

                console.error(config.logoutUserUrl, status, err.toString());

                deferredObject.resolve(that);
            }
        });

        return deferredObject.promise();
    },

    _logoutUser: function() {

        var that = this;

        this.logoutUser().done(function(){

            that.setState({
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
    },

    _disableLogging: function() {
        this.setState({
            loggingEnabled: false
        });

        changeExtensionState('notLogging');

        chrome.storage.sync.set({
            loggingEnabled: false
        });
    },

    _enableLogging: function() {
        this.setState({
            loggingEnabled: true
        });

        changeExtensionState('allGood');

        chrome.storage.sync.set({
            loggingEnabled: true
        });
    },

    render: function() {
        return (
            <div>
                <NavBar
                    user={this.state.user}
                    loggedIn={this.state.loggedIn} />
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <MainList
                                disableLogging={this._disableLogging}
                                enableLogging={this._enableLogging}
                                loggingEnabled={this.state.loggingEnabled}
                                user={this.state.user}
                                totalTimeLoggedToday={this.state.totalTimeLoggedToday}
                                logoutUser={this._logoutUser}
                                loggedIn={this.state.loggedIn} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = Wakatime;
