import React, { useEffect, useRef, useState } from 'react';
import config, { SuccessOrFailType } from '../config/config';
import apiKeyInvalid from '../utils/apiKey';
import { logUserIn } from '../utils/user';
import Alert from './Alert';
import SitesList from './SitesList';

interface State {
  alertText: string;
  alertType: SuccessOrFailType;
  apiKey: string;
  apiUrl: string;
  blacklist: string;
  displayAlert: boolean;
  hostname: string;
  loading: boolean;
  loggingStyle: string;
  loggingType: string;
  socialMediaSites: string[];
  theme: string;
  trackSocialMedia: boolean;
  whitelist: string;
}
export default function Options(): JSX.Element {
  const [state, setState] = useState<State>({
    alertText: config.alert.success.text,
    alertType: config.alert.success.type,
    apiKey: '',
    apiUrl: config.apiUrl,
    blacklist: '',
    displayAlert: false,
    hostname: '',
    loading: false,
    loggingStyle: config.loggingStyle,
    loggingType: config.loggingType,
    socialMediaSites: config.socialMediaSites,
    theme: config.theme,
    trackSocialMedia: config.trackSocialMedia,
    whitelist: '',
  });

  const loggingStyleRef = useRef(null);

  const restoreSettings = async (): Promise<void> => {
    const items = await browser.storage.sync.get({
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      blacklist: '',
      hostname: config.hostname,
      loggingStyle: config.loggingStyle,
      loggingType: config.loggingType,
      socialMediaSites: config.socialMediaSites,
      theme: config.theme,
      trackSocialMedia: true,
      whitelist: '',
    });

    // Handle prod accounts with old social media stored as string
    if (typeof items.socialMediaSites === 'string') {
      await browser.storage.sync.set({
        socialMediaSites: items.socialMediaSites.split('\n'),
      });
      items.socialMediaSites = items.socialMediaSites.split('\n');
    }

    setState({
      ...state,
      apiKey: items.apiKey as string,
      apiUrl: items.apiUrl as string,
      blacklist: items.blacklist as string,
      hostname: items.hostname as string,
      loggingStyle: items.loggingStyle as string,
      loggingType: items.loggingType as string,
      socialMediaSites: items.socialMediaSites as string[],
      theme: items.theme as string,
      trackSocialMedia: items.trackSocialMedia as boolean,
      whitelist: items.whitelist as string,
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

    const apiKey = state.apiKey;
    const theme = state.theme;
    const hostname = state.hostname;
    const loggingType = state.loggingType;
    const loggingStyle = state.loggingStyle;
    const trackSocialMedia = state.trackSocialMedia;
    const socialMediaSites = state.socialMediaSites;
    // Trimming blacklist and whitelist removes blank lines and spaces.
    const blacklist = state.blacklist.trim();
    const whitelist = state.whitelist.trim();
    let apiUrl = state.apiUrl;

    if (apiUrl.endsWith('/')) {
      apiUrl = apiUrl.slice(0, -1);
    }

    // Sync options with google storage.
    await browser.storage.sync.set({
      apiKey,
      apiUrl,
      blacklist,
      hostname,
      loggingStyle,
      loggingType,
      socialMediaSites,
      theme,
      trackSocialMedia,
      whitelist,
    });

    // Set state to be newly entered values.
    setState({
      ...state,
      apiKey,
      apiUrl,
      blacklist,
      displayAlert: true,
      hostname,
      loggingStyle,
      loggingType,
      socialMediaSites,
      theme,
      trackSocialMedia,
      whitelist,
    });
    await logUserIn(state.apiKey);
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

  const toggleSocialMedia = () => {
    setState({ ...state, trackSocialMedia: !state.trackSocialMedia });
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

  const isApiKeyValid = apiKeyInvalid(state.apiKey) === '';

  return (
    <div
      className="container"
      style={{
        height: 590,
        marginTop: 0,
        overflow: 'hidden',
        overflowY: 'scroll',
      }}
    >
      <div className="row">
        <div className="col-md-12">
          {alert()}

          <form className="form-horizontal">
            <div className="form-group">
              <label className="col-lg-2 control-label">API Key</label>

              <div className="col-lg-10">
                <input
                  autoFocus={true}
                  type="text"
                  className={`form-control ${isApiKeyValid ? '' : 'border-danger'}`}
                  placeholder="API key"
                  value={state.apiKey}
                  onChange={(e) => setState({ ...state, apiKey: e.target.value })}
                />
              </div>
            </div>

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
              <label htmlFor="theme" className="col-lg-2 control-label">
                Hostname
              </label>

              <div className="col-lg-10">
                <input
                  type="text"
                  className="form-control"
                  value={state.hostname}
                  onChange={(e) => setState({ ...state, hostname: e.target.value })}
                />
                <span className="help-block">
                  Optional name of local machine. By default &apos;Unknown Hostname&apos;.
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="theme" className="col-lg-2 control-label">
                API Url
              </label>

              <div className="col-lg-10">
                <input
                  type="text"
                  className="form-control"
                  value={state.apiUrl}
                  onChange={(e) => setState({ ...state, apiUrl: e.target.value })}
                  placeholder="https://api.wakatime.com/api/v1"
                />
                <span className="help-block">https://api.wakatime.com/api/v1</span>
              </div>
            </div>

            <div className="form-group row">
              <div className="col-lg-10 col-lg-offset-2 space-between align-items-center">
                <div>
                  <input
                    type="checkbox"
                    checked={state.trackSocialMedia}
                    onChange={toggleSocialMedia}
                  />
                  <span onClick={toggleSocialMedia}>Track social media sites</span>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  data-toggle="modal"
                  data-target="#socialSitesModal"
                >
                  Sites
                </button>
                <div
                  className="modal fade"
                  id="socialSitesModal"
                  role="dialog"
                  aria-labelledby="socialSitesModalLabel"
                >
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 className="modal-title" id="socialSitesModalLabel">
                          Social Media Sites
                        </h4>
                      </div>
                      <div className="modal-body">
                        <SitesList
                          handleChange={(sites: string) => {
                            setState({
                              ...state,
                              socialMediaSites: sites.split('\n'),
                            });
                          }}
                          label="Social"
                          sites={state.socialMediaSites.join('\n')}
                          helpText="Sites that you don't want to show in your reports."
                          rows={5}
                        />
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-dismiss="modal">
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
