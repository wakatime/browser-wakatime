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
        <p className="text-secondary">
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
        <li className="mb-2">
          <a
            target="_blank"
            href="https://wakatime.com/settings/rules"
            rel="noreferrer"
            className="text-body-secondary link-underline link-underline-opacity-0 d-flex w-100 align-items-center"
          >
            <i className="fa fa-fw fa-filter me-2"></i>
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
        <li className="mb-2">
          <a
            target="_blank"
            href="https://wakatime.com/dashboard"
            rel="noreferrer"
            className="text-body-secondary link-underline link-underline-opacity-0 d-flex w-100 align-items-center"
          >
            <i className="fa fa-fw fa-tachometer me-2"></i>
            Dashboard
          </a>
        </li>
      );
    } else {
      return <div />;
    }
  };

  return (
    <nav className="navbar shadow-none" role="navigation">
      <div className="navbar-header d-flex w-100 justify-content-between">
        <a target="_blank" className="navbar-brand" href="https://wakatime.com" rel="noreferrer">
          <img src="graphics/wakatime-logo-48.png" />
          <div>WakaTime</div>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#userInfoCollapse"
          aria-controls="userInfoCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Toggle navigation</span>
          <i className="fa fa-fw fa-cogs"></i>
        </button>
      </div>

      <div className="collapse navbar-collapse mt-4" id="userInfoCollapse">
        {signedInAs()}
        <ul className="nav navbar-nav border-bottom pb-2">
          {customRules()}
          {dashboard()}
          <li className="dropdown">
            <a
              href="#"
              className="dropdown-toggle text-body-secondary link-underline link-underline-opacity-0 d-flex w-100 align-items-center"
              data-bs-toggle="dropdown"
              role="button"
              aria-expanded="false"
            >
              <i className="fa fa-fw fa-info me-2"></i>
              About
              <span className="caret"></span>
            </a>
            <ul className="dropdown-menu shadow-none ms-4" role="menu">
              <li className="mb-2">
                <a
                  target="_blank"
                  href="https://github.com/wakatime/chrome-wakatime/issues"
                  rel="noreferrer"
                  className="text-body-secondary link-underline link-underline-opacity-0 d-flex w-100 align-items-center"
                >
                  <i className="fa fa-fw fa-bug me-2"></i>
                  Report an Issue
                </a>
              </li>
              <li className="mb-2">
                <a
                  target="_blank"
                  href="https://github.com/wakatime/chrome-wakatime"
                  rel="noreferrer"
                  className="text-body-secondary link-underline link-underline-opacity-0 d-flex w-100 align-items-center"
                >
                  <i className="fa fa-fw fa-github me-2"></i>
                  View on GitHub
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}
