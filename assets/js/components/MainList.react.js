var React = require('react');

class MainList extends React.Component
{
    componentDidMount()
    {

    }

    render()
    {
        return(
            <div className="list-group">
                <a href="#" className="list-group-item">
                    Options
                </a>
                <a href="#" className="list-group-item">
                    Custom Rules
                </a>
                <a href="#" className="list-group-item">
                    Dashboard
                </a>
                <a href="#" className="list-group-item">
                    Login
                </a>
                <a href="#" className="list-group-item">
                    Logout
                </a>
          </div>
        );
    }
}

export default MainList;
