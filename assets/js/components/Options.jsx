/* global chrome */

var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var config = require('../config');

// React components
var Alert = require('./Alert.jsx');
var SitesList = require('./SitesList.jsx');

/**
 * One thing to keep in  mind is that you cannot use this.refs.blacklist if
 * the blacklist select box is not being rendered on the form.
 *
 * @type {*|Function}
 */
var Options = React.createClass({

    getInitialState: function () {
        return {
            theme: config.theme,
            blacklist: '',
            whitelist: '',
            loggingType: config.loggingType,
            loggingStyle: config.loggingStyle,
            displayAlert: false,
            alertType: config.alert.success.type,
            alertText: config.alert.success.text
        };
    },

    componentDidMount: function () {
        this.restoreSettings();
    },

    restoreSettings: function () {
        var that = this;

        chrome.storage.sync.get({
            theme: config.theme,
            blacklist: '',
            whitelist: '',
            loggingType: config.loggingType,
            loggingStyle: config.loggingStyle
        }, function (items) {
            that.setState({
                theme: items.theme,
                blacklist: items.blacklist,
                whitelist: items.whitelist,
                loggingType: items.loggingType,
                loggingStyle: items.loggingStyle
            });

            that.refs.theme.value = items.theme;
            that.refs.loggingType.value = items.loggingType;
            that.refs.loggingStyle.value = items.loggingStyle;
        });
    },

    _handleSubmit: function (e) {
        e.preventDefault();

        this.saveSettings();
    },

    saveSettings: function () {
        var that = this;

        var theme = this.refs.theme.value.trim();
        var loggingType = this.refs.loggingType.value.trim();
        var loggingStyle = this.refs.loggingStyle.value.trim();
        // Trimming blacklist and whitelist removes blank lines and spaces.
        var blacklist = that.state.blacklist.trim();
        var whitelist = that.state.whitelist.trim();

        // Sync options with google storage.
        chrome.storage.sync.set({
            theme: theme,
            blacklist: blacklist,
            whitelist: whitelist,
            loggingType: loggingType,
            loggingStyle: loggingStyle
        }, function () {
            // Set state to be newly entered values.
            that.setState({
                theme: theme,
                blacklist: blacklist,
                whitelist: whitelist,
                loggingType: loggingType,
                loggingStyle: loggingStyle,
                displayAlert: true
            });
        });
    },

    _displayBlackOrWhiteList: function () {
        var loggingStyle = this.refs.loggingStyle.value.trim();

        this.setState({loggingStyle: loggingStyle});
    },

    _updateBlacklistState: function(sites){
        this.setState({
            blacklist: sites
        });
    },

    _updateWhitelistState: function(sites){
        this.setState({
            whitelist: sites
        });
    },

    render: function () {

        var that = this;

        var alert = function() {
            if(that.state.displayAlert === true){

                setTimeout(function () {
                    that.setState({displayAlert:false});
                }, 2000);

                return(
                    <Alert key={that.state.alertText} type={that.state.alertType} text={that.state.alertText} />
                );
            }
        };

        var loggingStyle = function () {

            if (that.state.loggingStyle == 'blacklist') {
                return (
                    <SitesList
                        handleChange={that._updateBlacklistState}
                        label="Blacklist"
                        sites={that.state.blacklist}
                        helpText="Sites that you don't want to show in your reports." />
                );
            }

            return (
                <SitesList
                    handleChange={that._updateWhitelistState}
                    label="Whitelist"
                    sites={that.state.whitelist}
                    helpText="Sites that you want to show in your reports." />
            );

        };

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">

                        <ReactCSSTransitionGroup transitionName="alert" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                            {alert()}
                        </ReactCSSTransitionGroup>

                        <form className="form-horizontal" onSubmit={this._handleSubmit}>

                            <div className="form-group">
                                <label className="col-lg-2 control-label">Logging style</label>

                                <div className="col-lg-10">
                                    <select className="form-control" ref="loggingStyle" defaultValue="blacklist" onChange={this._displayBlackOrWhiteList}>
                                        <option value="blacklist">All except blacklisted sites</option>
                                        <option value="whitelist">Only whitelisted sites</option>
                                    </select>
                                </div>
                            </div>

                            {loggingStyle()}

                            <div className="form-group">
                                <label className="col-lg-2 control-label">Logging type</label>

                                <div className="col-lg-10">
                                    <select className="form-control" ref="loggingType" defaultValue="domain">
                                        <option value="domain">Only the domain</option>
                                        <option value="url">Entire URL</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="theme" className="col-lg-2 control-label">Theme</label>

                                <div className="col-lg-10">
                                    <select className="form-control" ref="theme" defaultValue="light">
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="col-lg-10 col-lg-offset-2">
                                    <button type="submit" className="btn btn-primary">Save</button>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Options;
