var React = require("react");

var NavBar = require('./NavBar.react');
var MainList = require('./MainList.react');

var changeExtensionIcon = require('../helpers/changeExtensionIcon');

class WakaTime extends React.Component
{
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
    }

    render()
    {
        return(
            <div>
                <NavBar />
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <MainList />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default WakaTime;
