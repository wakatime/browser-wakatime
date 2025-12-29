import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { configLogout, setLoggingEnabled } from '../reducers/configReducer';
import { userLogout } from '../reducers/currentUser';
import { ReduxSelector } from '../types/store';
import { User } from '../types/user';
import changeExtensionState, { changeExtensionStatus } from '../utils/changeExtensionStatus';
import { ignoreSite } from '../utils/settings';

export interface MainListProps {
  currentTabUrl: string;
  isDomainIgnored: boolean;
  loggingEnabled: boolean;
  totalTimeLoggedToday?: string;
}
const openOptionsPage = async (): Promise<void> => {
  await browser.runtime.openOptionsPage();
};

export default function MainList({
  loggingEnabled,
  isDomainIgnored,
  totalTimeLoggedToday,
  currentTabUrl,
}: MainListProps): JSX.Element {
  const dispatch = useDispatch();
  const [hideIgnoreButton, setHideIgnoreButton] = useState(false);

  const user: User | undefined = useSelector(
    (selector: ReduxSelector) => selector.currentUser.user,
  );
  const isLoading: boolean = useSelector(
    (selector: ReduxSelector) => selector.currentUser.pending ?? true,
  );

  const logoutUser = async (): Promise<void> => {
    await browser.storage.sync.set({ apiKey: '' });
    dispatch(configLogout());
    dispatch(userLogout());
    await changeExtensionState('notSignedIn');
  };

  const enableLogging = async (): Promise<void> => {
    dispatch(setLoggingEnabled(true));
    await browser.storage.sync.set({ loggingEnabled: true });
    await changeExtensionState('allGood');
  };

  const disableLogging = async (): Promise<void> => {
    dispatch(setLoggingEnabled(false));
    await browser.storage.sync.set({ loggingEnabled: false });
    await changeExtensionState('trackingDisabled');
  };

  const ignoreSitePressed = async (): Promise<void> => {
    await ignoreSite(currentTabUrl);
    await changeExtensionStatus('ignored');
    setHideIgnoreButton(true);
  };

  const loading = isLoading ? (
    <div className="placeholder-glow">
      <span className="placeholder col-12"></span>
    </div>
  ) : null;

  return (
    <div>
      {user ? (
        <div className="row">
          <div className="col-xs-12">
            <blockquote>
              <p>{totalTimeLoggedToday}</p>
              <small>
                <cite className="text-body-secondary">TOTAL TIME LOGGED TODAY</cite>
              </small>
            </blockquote>
          </div>
        </div>
      ) : (
        loading
      )}

      {!isDomainIgnored && user && !hideIgnoreButton ? (
        <div className="row">
          <div className="col-xs-12">
            <p>
              <a
                href="#"
                onClick={ignoreSitePressed}
                className="btn btn-danger btn-block w-100 btn-sm"
              >
                <i className="fa fa-fw fa-eye-slash me-2" />
                Ignore site
              </a>
            </p>
          </div>
        </div>
      ) : (
        loading
      )}
      <div className="list-group my-3">
        <a href="#" className="list-group-item text-body-secondary" onClick={openOptionsPage}>
          <i className="fa fa-fw fa-cogs me-2" />
          Options
        </a>
        {isLoading ? null : user ? (
          <div>
            <a href="#" className="list-group-item text-body-secondary" onClick={logoutUser}>
              <i className="fa fa-fw fa-sign-out me-2" />
              Logout
            </a>
          </div>
        ) : (
          <a
            target="_blank"
            rel="noreferrer"
            href="https://wakatime.com/login"
            className="list-group-item text-body-secondary"
          >
            <i className="fa fa-fw fa-sign-in me-2" />
            Login
          </a>
        )}
      </div>
      {loggingEnabled && user ? (
        <div className="row">
          <div className="col-xs-12">
            <p>
              <a
                href="#"
                onClick={disableLogging}
                className="btn btn-danger btn-block w-100 btn-sm"
              >
                Disable logging
              </a>
            </p>
          </div>
        </div>
      ) : (
        loading
      )}
      {!loggingEnabled && user ? (
        <div className="row">
          <div className="col-xs-12">
            <p>
              <a
                href="#"
                onClick={enableLogging}
                className="btn btn-success btn-block w-100 btn-sm"
              >
                Enable logging
              </a>
            </p>
          </div>
        </div>
      ) : (
        loading
      )}
    </div>
  );
}
