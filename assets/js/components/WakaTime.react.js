//jshint esnext:true

import React from "react";
import $ from 'jquery';
import NavBar from './NavBar.react.js';
import MainList from './MainList.react.js';
import changeExtensionIcon from '../helpers/changeExtensionIcon.js';
import WakaTimeOriginal from '../WakaTime.js';

class WakaTime extends React.Component {

    constructor(props) {
        super(props);
        this.logoutUserUrl = 'https://wakatime.com/logout';
        this.state = {
            user: {
                full_name: null,
                email: null,
                photo: null
            },
            loggedIn: false,
            loggingEnabled: false
        };
    }

    componentDidMount() {

        var wakatime = new WakaTimeOriginal;

        wakatime.checkAuth().done(data => {

            if (data !== false) {

                chrome.storage.sync.get({
                    loggingEnabled: false
                }, (items) => {
                    this.setState({loggingEnabled: items.loggingEnabled});
                    if (items.loggingEnabled === true) {
                        changeExtensionIcon();
                    }
                    else {
                        changeExtensionIcon('red');
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
                changeExtensionIcon('red');
            }
        });

    }

    logoutUser() {
        var deferredObject = $.Deferred();

        $.ajax({
            url: this.logoutUserUrl,
            method: 'GET',
            success: () => {

                deferredObject.resolve(this);

            },
            error: (xhr, status, err) => {

                console.error(this.logoutUserUrl, status, err.toString());

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

            changeExtensionIcon('red');

        });
    }

    _disableLogging() {
        this.setState({
            loggingEnabled: false
        });

        changeExtensionIcon('red');

        chrome.storage.sync.set({
            loggingEnabled: false
        });
    }

    _enableLogging() {
        this.setState({
            loggingEnabled: true
        });

        changeExtensionIcon();

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
