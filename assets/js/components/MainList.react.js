var React = require('react');

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
        return(
            <div className="list-group">
                <a href="#" className="list-group-item" onClick={this._openOptionsPage}>
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
