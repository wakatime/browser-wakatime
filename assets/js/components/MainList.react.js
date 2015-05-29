var React = require('react');

var md5 = require('blueimp-md5').md5;

class MainList extends React.Component
{
    componentDidMount()
    {

    }

    _openOptionsPage()
    {
      if (chrome.runtime.openOptionsPage) {
        // New way to open options pages, if supported (Chrome 42+).
        chrome.runtime.openOptionsPage();
      } else {
        // Reasonable fallback.
        window.open(chrome.runtime.getURL('options.html'));
      }
    }

    render()
    {
        var loginLogoutButton = () => {
            if(this.props.loggedIn === true)
            {
                return (
                    <div>
                    <a target="_blank" href="https://wakatime.com/settings/rules" className="list-group-item">
                        <i className="fa fa-fw fa-filter"></i> Custom Rules
                    </a>
                    <a target="_blank" href="https://wakatime.com/dashboard" className="list-group-item">
                        <i className="fa fa-fw fa-tachometer"></i> Dashboard
                    </a>
                    <a href="#" className="list-group-item" onClick={this.props.logoutUser}>
                        <i className="fa fa-fw fa-sign-out"></i> Logout
                    </a>
                    </div>
                );
            }

            return (
                <a target="_blank" href="https://wakatime.com/login" className="list-group-item">
                    <i className="fa fa-fw fa-sign-in"></i> Login
                </a>
            );
        };

        var signedInAs = () => {
            if(this.props.loggedIn === true)
            {
                var src = "https://secure.gravatar.com/avatar/" + md5(this.props.user.email) + "/?s=48";

                return (
                    <div className="panel panel-default">
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-xs-2">
                                    <img className="img-circle" src={src} />
                                </div>
                                <div className="col-xs-10">
                                    Signed in as <b>{this.props.user.full_name}</b><br />
                                    {this.props.user.email}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        };

        return(
            <div>

                {signedInAs()}

                <div className="list-group">
                    <a href="#" className="list-group-item" onClick={this._openOptionsPage}>
                        <i className="fa fa-fw fa-cogs"></i> Options
                    </a>

                    {loginLogoutButton()}

                </div>
            </div>
        );
    }
}

export default MainList;
