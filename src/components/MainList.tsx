export interface MainListProps {
  disableLogging: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  enableLogging: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  loggedIn: boolean;
  loggingEnabled: boolean;
  logoutUser: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  totalTimeLoggedToday?: string;
}
const openOptionsPage = async (): Promise<void> => {
  await browser.runtime.openOptionsPage();
};

export default function MainList({
  disableLogging,
  enableLogging,
  loggedIn,
  loggingEnabled,
  logoutUser,
  totalTimeLoggedToday,
}: MainListProps): JSX.Element {
  return (
    <div>
      {loggedIn && (
        <div className="row">
          <div className="col-xs-12">
            <blockquote>
              <p>{totalTimeLoggedToday}</p>
              <small>
                <cite>TOTAL TIME LOGGED TODAY</cite>
              </small>
            </blockquote>
          </div>
        </div>
      )}
      {loggingEnabled && loggedIn && (
        <div className="row">
          <div className="col-xs-12">
            <p>
              <a href="#" onClick={disableLogging} className="btn btn-danger btn-block">
                Disable logging
              </a>
            </p>
          </div>
        </div>
      )}
      {!loggingEnabled && loggedIn && (
        <div className="row">
          <div className="col-xs-12">
            <p>
              <a href="#" onClick={enableLogging} className="btn btn-success btn-block">
                Enable logging
              </a>
            </p>
          </div>
        </div>
      )}
      <div className="list-group">
        <a href="#" className="list-group-item" onClick={openOptionsPage}>
          <i className="fa fa-fw fa-cogs"></i>
          Options
        </a>
        {loggedIn && (
          <div>
            <a href="#" className="list-group-item" onClick={logoutUser}>
              <i className="fa fa-fw fa-sign-out"></i>
              Logout
            </a>
          </div>
        )}
        {!loggedIn && (
          <a
            target="_blank"
            rel="noreferrer"
            href="https://wakatime.com/login"
            className="list-group-item"
          >
            <i className="fa fa-fw fa-sign-in"></i>
            Login
          </a>
        )}
      </div>
    </div>
  );
}
