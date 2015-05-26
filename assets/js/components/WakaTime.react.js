var React = require("react");

var NavBar = require('./NavBar.react');
var MainList = require('./MainList.react');

class WakaTime extends React.Component
{
    componentDidMount()
    {

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
