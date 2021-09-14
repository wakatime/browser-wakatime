/* global browser */

var React = require('react');
var reactCreateClass = require('create-react-class');
var $ = require('jquery');

var config = require('../config');

// React components
var NavBar = require('./NavBar.jsx');
var MainList = require('./MainList.jsx');

// Core
var WakaTimeCore = require('../core/WakaTimeCore').default;

// Helpers
var changeExtensionState = require('../helpers/changeExtensionState');

var Wakatime = reactCreateClass({
  getInitialState: function () {
    return {
      user: {
        full_name: null,
        email: null,
        photo: null,
display_name: null,
                last_project: null,
                username: null
      },
      loggedIn: false,
      loggingEnabled: config.loggingEnabled,
      totalTimeLoggedToday: '0 minutes',
 projectType: config.projectType,
            globalRank: null,
            defaultProjectName: config.defaultProjectName,
            projectName: config.projectName,
            show_project_editor: false
    };
  },

  componentDidMount: function () {
    var wakatime = new WakaTimeCore();

    var that = this;

    wakatime.checkAuth().done(function (data) {
      if (data !== false) {
        browser.storage.sync
          .get({
            loggingEnabled: config.loggingEnabled,
projectType: config.projectType,
                    projectName: config.projectName,
                    defaultProjectName: config.defaultProjectName
          })
          .then(function (items) {
             var projectName = items.projectName;

                    if (items.projectName === null) {
                        if(items.projectType == 'last')
                        {
                            projectName = data.last_project;
                        }else{
                            projectName = items.defaultProjectName;
                        }
                        
                    }

                    that.setState({ loggingEnabled: items.loggingEnabled, projectName: projectName});


            if (items.loggingEnabled === true) {
              changeExtensionState('allGood');
            } else {
              changeExtensionState('notLogging');
            }
          });

        that.setState({
          user: {
            full_name: data.full_name,
            email: data.email,
            photo: data.photo,
display_name: data.display_name,
                        last_project: data.last_project,
                        username: data.username
          },
          loggedIn: true,
                    globalRank: null
        });

        wakatime.getTotalTimeLoggedToday().done(function (grand_total) {
          that.setState({
            totalTimeLoggedToday: grand_total.text,
          });
        });

              wakatime.getRanking().done(function (rank) {
                    that.setState({
                        globalRank: rank.text
                    });
                });

        wakatime.recordHeartbeat();
      } else {
        changeExtensionState('notSignedIn');
      }
    });
  },

  logoutUser: function () {
    var deferredObject = $.Deferred();

    var that = this;

    $.ajax({
      url: config.logoutUserUrl,
      method: 'GET',
      success: function () {
        deferredObject.resolve(that);
      },
      error: function (xhr, status, err) {
        console.error(config.logoutUserUrl, status, err.toString());

        deferredObject.resolve(that);
      },
    });

    return deferredObject.promise();
  },

  _logoutUser: function () {
    var that = this;

    this.logoutUser().done(function () {
      that.setState({
        user: {
          full_name: null,
          email: null,
          photo: null,
        },
        loggedIn: false,
        loggingEnabled: false,
      });

      changeExtensionState('notSignedIn');
    });
  },

  _disableLogging: function () {
    this.setState({
      loggingEnabled: false,
    });

    changeExtensionState('notLogging');

    browser.storage.sync.set({
      loggingEnabled: false,
    });
  },

  _enableLogging: function () {
    this.setState({
      loggingEnabled: true,
    });

    changeExtensionState('allGood');

    browser.storage.sync.set({
      loggingEnabled: true,
    });
  },

  _updateLastProjectState: function (last_project) {
        this.setState({
            user: {
                full_name: this.full_name,
                email: this.email,
                photo: this.photo,
                display_name: this.display_name,
                last_project: last_project,
                username: this.username
            },
        });

        changeExtensionState('allGood');

        chrome.storage.sync.set({
            loggingEnabled: true
        });
    },

    updateEditor: function (event) {
        var projectName = event.target.value;

        this.setState({
            projectName: projectName,
        });
 
        if(projectName == null || projectName == this.defaultProjectName || projectName == this.state.user.last_project){
            changeExtensionState('allGood');
        }else{
            changeExtensionState('allGoodOverride');
        }
        
    },

     handleKeyPress: function(event) {
        if(event.charCode==13){
            var projectName = event.target.value;

            this.setState({
                projectName: projectName,
            });
     
            if(projectName == null || projectName == this.defaultProjectName || projectName == this.state.user.last_project){
                changeExtensionState('allGood');
            }else{
                changeExtensionState('allGoodOverride');
            }
            this.toggleEditor;
        } 
      },


    toggleEditor: function () {
        var value = false;

        if (this.state.show_project_editor === false) {
            value = true;
           
        } 

        this.setState({
            show_project_editor: value
        });

    },

  render: function () {
    return (
      <div>
        <NavBar user={this.state.user} loggedIn={this.state.loggedIn} />
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <MainList
                                disableLogging={this._disableLogging}
                                enableLogging={this._enableLogging}
                                loggingEnabled={this.state.loggingEnabled}
                                handleKeyPress={this.handleKeyPress}
                                user={this.state.user}
                                totalTimeLoggedToday={this.state.totalTimeLoggedToday}
                                logoutUser={this._logoutUser}
                                loggedIn={this.state.loggedIn} />
            </div>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = Wakatime;
