var React = require('react');
var ReactAddons = require('react/addons');
var ReactCSSTransitionGroup = ReactAddons.addons.CSSTransitionGroup;

var config = require('../config');

// React components
var Alert = require('./Alert.react');

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

            // TODO: Create a component for blacklist/white list

            if (items.loggingStyle == 'blacklist') {
                React.findDOMNode(that.refs.blacklist).value = items.blacklist;
            }
            else if (items.loggingStyle == 'whitelist') {
                React.findDOMNode(that.refs.whitelist).value = items.whitelist;
            }

            React.findDOMNode(that.refs.theme).value = items.theme;
            React.findDOMNode(that.refs.loggingType).value = items.loggingType;
            React.findDOMNode(that.refs.loggingStyle).value = items.loggingStyle;
        });
    },

    _handleSubmit: function (e) {
        e.preventDefault();

        this.saveSettings();
    },

    saveSettings: function () {
        var that = this;

        var theme = React.findDOMNode(this.refs.theme).value.trim();
        var loggingType = React.findDOMNode(this.refs.loggingType).value.trim();
        var loggingStyle = React.findDOMNode(this.refs.loggingStyle).value.trim();

        var blacklist = this.state.blacklist;
        var whitelist = this.state.whitelist;

        // Depending on logging style load blacklist or white list value from form.
        if (loggingStyle == 'blacklist') {
            blacklist = React.findDOMNode(this.refs.blacklist).value.trim();
        } else if (loggingStyle == 'whitelist') {
            whitelist = React.findDOMNode(this.refs.whitelist).value.trim();
        }

        // TODO: Bind blacklist and whitelist to state and validate user input.

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

    /**
     * After the component renders this detects the logging style
     * and updates the form blacklist or white list value.
     */
    componentDidUpdate: function() {
        if (this.state.loggingStyle == 'blacklist') {
            React.findDOMNode(this.refs.blacklist).value = this.state.blacklist;
        }
        else if (this.state.loggingStyle == 'whitelist') {
            React.findDOMNode(this.refs.whitelist).value = this.state.whitelist;
        }
    },

    _displayBlackOrWhiteList: function () {
        var loggingStyle = React.findDOMNode(this.refs.loggingStyle).value.trim();

        this.setState({loggingStyle: loggingStyle});
    },

    render: function () {

        var that = this;

        var alert = function() {
            if(that.state.displayAlert == true){

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
                    <div className="form-group">
                        <label htmlFor="blacklist" className="col-lg-2 control-label">Blacklist</label>

                        <div className="col-lg-10">
                            <textarea className="form-control" rows="3" ref="blacklist"
                                placeholder="http://google.com"></textarea>
                            <span className="help-block">Sites that you don't want to show in your reports.
                                <br/>
                                One line per site.</span>
                        </div>
                    </div>
                );
            }

            return (
                <div className="form-group">
                    <label htmlFor="whitelist" className="col-lg-2 control-label">Whitelist</label>

                    <div className="col-lg-10">
                        <textarea className="form-control" rows="3" ref="whitelist"
                            placeholder="http://google.com"></textarea>
                        <span className="help-block">Sites that you want to show in your reports.
                            <br/>
                            One line per site.</span>
                    </div>
                </div>
            );

        };

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">

                        <ReactCSSTransitionGroup transitionName="alert">
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