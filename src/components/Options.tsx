import React, { useRef, useState, useEffect } from 'react';
import config, { SuccessOrFailType } from '../config/config';
import Alert from './Alert';
import SitesList from './SitesList';

interface State {
  alertText: string;
  alertType: SuccessOrFailType;
  blacklist: string;
  displayAlert: boolean;
  loading: boolean;
  loggingStyle: string;
  loggingType: string;
  theme: string;
  whitelist: string;
}
export default function Options(): JSX.Element {
  const [state, setState] = useState<State>({
    alertText: config.alert.success.text,
    alertType: config.alert.success.type,
    blacklist: '',
    displayAlert: false,
    loading: false,
    loggingStyle: config.loggingStyle,
    loggingType: config.loggingType,
    theme: config.theme,
    whitelist: '',
  });

  const loggingStyleRef = useRef(null);

  const restoreSettings = async (): Promise<void> => {
    const items = await browser.storage.sync.get({
      blacklist: '',
      loggingStyle: config.loggingStyle,
      loggingType: config.loggingType,
      theme: config.theme,
      whitelist: '',
    });
    setState({
      ...state,
      blacklist: items.blacklist,
      loggingStyle: items.loggingStyle,
      loggingType: items.loggingType,
      theme: items.theme,
      whitelist: items.whitelist,
    });
  };

  useEffect(() => {
    void restoreSettings();
  }, []);

  useEffect(() => {
    if (state.displayAlert) {
      setTimeout(function () {
        setState({ ...state, displayAlert: false, loading: false });
      }, 2500);
    }
  }, [state.displayAlert]);

  const handleSubmit = async () => {
    if (state.loading) return;
    setState({ ...state, loading: true });

    const theme = state.theme;
    const loggingType = state.loggingType;
    const loggingStyle = state.loggingStyle;
    // Trimming blacklist and whitelist removes blank lines and spaces.
    const blacklist = state.blacklist.trim();
    const whitelist = state.whitelist.trim();

    // Sync options with google storage.
    await browser.storage.sync.set({
      blacklist: blacklist,
      loggingStyle: loggingStyle,
      loggingType: loggingType,
      theme: theme,
      whitelist: whitelist,
    });

    // Set state to be newly entered values.
    setState({
      ...state,
      blacklist: blacklist,
      displayAlert: true,
      loggingStyle: loggingStyle,
      loggingType: loggingType,
      theme: theme,
      whitelist: whitelist,
    });
  };

  const updateBlacklistState = (sites: string) => {
    setState({
      ...state,
      blacklist: sites,
    });
  };

  const updateWhitelistState = (sites: string) => {
    setState({
      ...state,
      whitelist: sites,
    });
  };

  const loggingStyle = function () {
    if (state.loggingStyle == 'blacklist') {
      return (
        <SitesList
          handleChange={updateBlacklistState}
          label="Blacklist"
          sites={state.blacklist}
          helpText="Sites that you don't want to show in your reports."
        />
      );
    }

    return (
      <SitesList
        handleChange={updateWhitelistState}
        label="Whitelist"
        sites={state.whitelist}
        placeholder="http://google.com&#10;http://myproject.com/MyProject"
        helpText="Sites that you want to show in your reports. You can assign URL to project by adding @@YourProject at the end of line."
      />
    );
  };

  const alert = () => {
    return (
      <div
        style={{
          height: state.displayAlert ? 55 : 0,
          opacity: state.displayAlert ? 1 : 0,
          transition: 'opacity 500ms, height 1000ms',
        }}
      >
        <Alert key={state.alertText} type={state.alertType} text={state.alertText} />
      </div>
    );
  };

  return (
    <div
      className="container"
      style={{
        height: 515,
        overflow: 'hidden',
        overflowY: 'scroll',
      }}
    >
      <div className="row">
        <div className="col-md-12">
          {alert()}

          <form className="form-horizontal">
            <div className="form-group">
              <label className="col-lg-2 control-label">Logging style!</label>

              <div className="col-lg-10">
                <select
                  ref={loggingStyleRef}
                  className="form-control"
                  value={state.loggingStyle}
                  onChange={(e) => setState({ ...state, loggingStyle: e.target.value })}
                >
                  <option value="blacklist">All except blacklisted sites</option>
                  <option value="whitelist">Only whitelisted sites</option>
                </select>
              </div>
            </div>

            {loggingStyle()}

            <div className="form-group">
              <label className="col-lg-2 control-label">Logging type</label>

              <div className="col-lg-10">
                <select
                  className="form-control"
                  value={state.loggingType}
                  onChange={(e) => setState({ ...state, loggingType: e.target.value })}
                >
                  <option value="domain">Only the domain</option>
                  <option value="url">Entire URL</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="theme" className="col-lg-2 control-label">
                Theme
              </label>

              <div className="col-lg-10">
                <select
                  className="form-control"
                  value={state.theme}
                  onChange={(e) => setState({ ...state, theme: e.target.value })}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <div className="col-lg-10 col-lg-offset-2">
                <button
                  type="button"
                  className={`btn btn-primary ${state.loading ? 'disabled' : ''}`}
                  disabled={state.loading}
                  data-loading-text="Loading..."
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
