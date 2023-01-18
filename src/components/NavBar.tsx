import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { configLogout, setApiKey } from '../reducers/configReducer';
import { userLogout } from '../reducers/currentUser';
import { ReduxSelector } from '../types/store';
import { User } from '../types/user';
import config from '../config/config';
import apiKeyInvalid from '../utils/apiKey';
import { fetchUserData } from '../utils/user';

export default function NavBar(): JSX.Element {
  const [state, setState] = useState({
    apiKey: '',
    apiKeyError: '',
    loading: false,
  });
  useEffect(() => {
    const fetch = async () => {
      const { apiKey } = await browser.storage.sync.get({ apiKey: config.apiKey });
      setState({ ...state, apiKey });
    };

    fetch();
  }, []);

  const dispatch = useDispatch();
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
            <li>
              <div className="container-fluid">
                {state.apiKeyError && (
                  <div className="alert alert-danger" role="alert">
                    {state.apiKeyError}
                  </div>
                )}
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="API key"
                    value={state.apiKey}
                    onChange={(e) => {
                      const key = e.target.value;
                      const isApiKeyInvalid = apiKeyInvalid(key);
                      setState({ ...state, apiKey: key, apiKeyError: isApiKeyInvalid });
                    }}
                  />
                  <span className="input-group-btn">
                    <button
                      className={`btn btn-default ${state.loading ? 'disabled' : ''}`}
                      disabled={state.loading}
                      type="button"
                      data-loading-text="Loading..."
                      onClick={async () => {
                        if (state.apiKeyError === '' && state.apiKey !== '') {
                          setState({ ...state, loading: true });
                          await browser.storage.sync.set({ apiKey: state.apiKey });
                          dispatch(configLogout());
                          dispatch(userLogout());
                          dispatch(setApiKey(state.apiKey));

                          await fetchUserData(state.apiKey, dispatch);
                          setState({ ...state, loading: false });
                        }
                      }}
                    >
                      Save
                    </button>
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
