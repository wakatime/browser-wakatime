import React from 'react';
import { useSelector } from 'react-redux';
import { ReduxSelector } from '../types/store';
import { User } from '../types/user';

export default function NavBar(): JSX.Element {
  const user: User | undefined = useSelector(
    (selector: ReduxSelector) => selector.currentUser.user,
  );

  const signedInAs = () => {
    if (user) {
      return (
        <p className="navbar-text">
          Signed in as <b>{user.full_name}</b>
        </p>
      );
    } else {
      return <div />;
    }
  };

  const customRules = () => {
    if (user) {
      return (
        <li>
          <a target="_blank" href="https://wakatime.com/settings/rules" rel="noreferrer">
            <i className="fa fa-fw fa-filter"></i>
            Custom Rules
          </a>
        </li>
      );
    } else {
      return <div />;
    }
  };

  const dashboard = () => {
    if (user) {
      return (
        <li>
          <a target="_blank" href="https://wakatime.com/dashboard" rel="noreferrer">
            <i className="fa fa-fw fa-tachometer"></i>
            Dashboard
          </a>
        </li>
      );
    } else {
      return <div />;
    }
  };

  return (
    <nav className="navbar navbar-default" role="navigation">
      <div className="container-fluid">
        <div className="navbar-header">
          <a target="_blank" className="navbar-brand" href="https://wakatime.com" rel="noreferrer">
            WakaTime
            <img src="graphics/wakatime-logo-48.png" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#bs-example-navbar-collapse-1"
            aria-controls="bs-example-navbar-collapse-1"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Toggle navigation</span>
            <i className="fa fa-fw fa-cogs"></i>
          </button>
        </div>
        <br />
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          {signedInAs()}
          <ul className="nav navbar-nav">
            {customRules()}
            {dashboard()}
            <li className="dropdown">
              <a
                href="#"
                className="dropdown-toggle"
                data-toggle="dropdown"
                role="button"
                aria-expanded="false"
              >
                <i className="fa fa-fw fa-info"></i>
                About
                <span className="caret"></span>
              </a>
              <ul className="dropdown-menu" role="menu">
                <li>
                  <a
                    target="_blank"
                    href="https://github.com/wakatime/chrome-wakatime/issues"
                    rel="noreferrer"
                  >
                    <i className="fa fa-fw fa-bug"></i>
                    Report an Issue
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://github.com/wakatime/chrome-wakatime"
                    rel="noreferrer"
                  >
                    <i className="fa fa-fw fa-github"></i>
                    View on GitHub
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
