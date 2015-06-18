/* global chrome */

var React = require('react');

var MainList = React.createClass({

    _openOptionsPage: function() {
        if (chrome.runtime.openOptionsPage) {
            // New way to open options pages, if supported (Chrome 42+).
            chrome.runtime.openOptionsPage();
        } else {
            // Reasonable fallback.
            window.open(chrome.runtime.getURL('options.html'));
        }
    },

    render: function() {

        var that = this;

        var loginLogoutButton = function() {
            if (that.props.loggedIn === true) {
                return (
                    <div>
                        <a href="#" className="list-group-item" onClick={that.props.logoutUser}>
                            <i className="fa fa-fw fa-sign-out"></i>
                            Logout
                        </a>
                    </div>
                );
            }

            return (
                <a target="_blank" href="https://wakatime.com/login" className="list-group-item">
                    <i className="fa fa-fw fa-sign-in"></i>
                    Login
                </a>
            );
        };

        // If logging is enabled, display that info to user
        var loggingStatus = function() {
            if(that.props.loggingEnabled === true && that.props.loggedIn === true)
            {
                return (
                    <div className="row">
                        <div className="col-xs-12">
                            <p>
                                <a href="#" onClick={that.props.disableLogging} className="btn btn-danger btn-block">Disable logging</a>
                            </p>
                        </div>
                    </div>
                );
            }
            else if(that.props.loggingEnabled === false && that.props.loggedIn === true)
            {
                return (
                    <div className="row">
                        <div className="col-xs-12">
                            <p>
                                <a href="#" onClick={that.props.enableLogging} className="btn btn-success btn-block">Enable logging</a>
                            </p>
                        </div>
                    </div>
                );
            }
        };

        var totalTimeLoggedToday = function() {
            if (that.props.loggedIn === true) {
                return (
                    <div className="row">
                        <div className="col-xs-12">
                            <blockquote>
                                <p>{that.props.totalTimeLoggedToday}</p>
                                <small><cite>TOTAL TIME LOGGED TODAY</cite></small>
                            </blockquote>
                        </div>
                    </div>
                );
            }
        };

        return (
            <div>

                {totalTimeLoggedToday()}

                {loggingStatus()}

                <div className="list-group">
                    <a href="#" className="list-group-item" onClick={this._openOptionsPage}>
                        <i className="fa fa-fw fa-cogs"></i>
                        Options
                    </a>

                    {loginLogoutButton()}

                </div>
            </div>
        );
    }

});

module.exports = MainList;
