import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { configLogout, setLoggingEnabled } from '../reducers/configReducer';
import { userLogout } from '../reducers/currentUser';
import { ReduxSelector } from '../types/store';
import { User } from '../types/user';
import changeExtensionState from '../utils/changeExtensionState';

export interface MainListProps {
  loggingEnabled: boolean;
  totalTimeLoggedToday?: string;
}
const openOptionsPage = async (): Promise<void> => {
  await browser.runtime.openOptionsPage();
};

export default function MainList({
  loggingEnabled,
  totalTimeLoggedToday,
}: MainListProps): JSX.Element {
  const dispatch = useDispatch();

  const user: User | undefined = useSelector(
    (selector: ReduxSelector) => selector.currentUser.user,
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
    await changeExtensionState('notLogging');
  };

  return (
    <div>
      {user && (
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
      )}
      {loggingEnabled && user && (
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
      )}
      {!loggingEnabled && user && (
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
      )}
      <div className="list-group">
        <a href="#" className="list-group-item text-body-secondary" onClick={openOptionsPage}>
          <i className="fa fa-fw fa-cogs me-2"></i>
          Options
        </a>
        {user && (
          <div>
            <a href="#" className="list-group-item text-body-secondary" onClick={logoutUser}>
              <i className="fa fa-fw fa-sign-out me-2"></i>
              Logout
            </a>
          </div>
        )}
        {!user && (
          <a
            target="_blank"
            rel="noreferrer"
            href="https://wakatime.com/login"
            className="list-group-item text-body-secondary"
          >
            <i className="fa fa-fw fa-sign-in me-2"></i>
            Login
          </a>
        )}
      </div>
    </div>
  );
}
