//jshint esnext:true

var React = require('react');

class MainList extends React.Component {
    componentDidMount() {

    }

    _openOptionsPage() {
        if (chrome.runtime.openOptionsPage) {
            // New way to open options pages, if supported (Chrome 42+).
            chrome.runtime.openOptionsPage();
        } else {
            // Reasonable fallback.
            window.open(chrome.runtime.getURL('options.html'));
        }
    }

    render() {
        var loginLogoutButton = () => {
            if (this.props.loggedIn === true) {
                return (
                    <div>
                        <a target="_blank" href="https://wakatime.com/settings/rules" className="list-group-item">
                            <i className="fa fa-fw fa-filter"></i>
                            Custom Rules
                        </a>
                        <a target="_blank" href="https://wakatime.com/dashboard" className="list-group-item">
                            <i className="fa fa-fw fa-tachometer"></i>
                            Dashboard
                        </a>
                        <a href="#" className="list-group-item" onClick={this.props.logoutUser}>
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
        var loggingStatus = () => {
            if(this.props.loggingEnabled === true && this.props.loggedIn === true)
            {
                return (
                    <div className="panel panel-default">
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-xs-12">
                                    <a href="#" onClick={this.props.disableLogging} className="btn btn-danger btn-lg btn-block">Disable logging</a>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            else if(this.props.loggingEnabled === false && this.props.loggedIn === true)
            {
                return (
                    <div className="panel panel-default">
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-xs-12">
                                    <a href="#" onClick={this.props.enableLogging} className="btn btn-success btn-lg btn-block">Enable logging</a>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        };

        var signedInAs = () => {
            if (this.props.loggedIn === true) {
                return (
                    <div className="panel panel-default">
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-xs-2">
                                    <img className="img-circle" width="48" height="48" src={this.props.user.photo} />
                                </div>
                                <div className="col-xs-10">
                                    Signed in as&nbsp;
                                    <b>{this.props.user.full_name}</b>
                                    <br />
                                    {this.props.user.email}
                                </div>
                            </div>

                        </div>
                    </div>
                );
            }
        };

        return (
            <div>

                {signedInAs()}

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
}

export default MainList;
