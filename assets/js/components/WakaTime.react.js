var React = require("react");
var $ = require('jquery');

var NavBar = require('./NavBar.react');
var MainList = require('./MainList.react');

var changeExtensionIcon = require('../helpers/changeExtensionIcon');

var WakaTimeOriginal = require('../WakaTime');

class WakaTime extends React.Component
{
    logoutUserUrl = 'https://wakatime.com/logout';

    state = {
        user: {
            full_name: null,
            email: null,
            photo: null
        },
        loggedIn: false
    };

    componentDidMount()
    {
      chrome.storage.sync.get({
        theme: 'light'
      }, function(items) {
        if(items.theme == 'light') {
          changeExtensionIcon();
        }
        else {
          changeExtensionIcon('white');
        }
      });

      var wakatime = new WakaTimeOriginal;

      wakatime.checkAuth().done(data => {

          if(data !== false){

              this.setState({
                  user: {
                      full_name: data.full_name,
                      email: data.email,
                      photo: data.photo
                  },
                  loggedIn: true
              });

              changeExtensionIcon();

          }
          else {

              changeExtensionIcon('red');

              //TODO: Redirect user to wakatime login page.
              //
          }
      });

    }

    logoutUser()
    {
        var deferredObject = $.Deferred();

        $.ajax({
            url: this.logoutUserUrl,
            method: 'GET',
            success: () =>  {

                deferredObject.resolve(this);

            },
            error: (xhr, status, err) => {

                console.error(this.logoutUserUrl, status, err.toString());

                deferredObject.resolve(this);
            }
        });

        return deferredObject.promise();
    }

    _logoutUser()
    {
        this.logoutUser().done(() => {

            this.setState({
                user: {
                    full_name: null,
                    email: null,
                    photo: null
                },
                loggedIn: false
            });

            changeExtensionIcon('red');

        });
    }

    render()
    {
        return(
            <div>
                <NavBar />
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <MainList user={this.state.user} logoutUser={this._logoutUser.bind(this)} loggedIn={this.state.loggedIn} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default WakaTime;
