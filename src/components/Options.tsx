import React, { useEffect, useRef, useState } from 'react';
import config, { SuccessOrFailType } from '../config/config';
import { IS_CHROME } from '../utils';
import apiKeyInvalid from '../utils/apiKey';
import { getSettings, saveSettings, Settings } from '../utils/settings';
import { logUserIn } from '../utils/user';
import SitesList from './SitesList';

interface State extends Settings {
  alertText: string;
  alertType: SuccessOrFailType;
  loading: boolean;
}

export default function Options(): JSX.Element {
  const [state, setState] = useState<State>({
    alertText: config.alert.success.text,
    alertType: config.alert.success.type,
    allowList: [],
    apiKey: '',
    apiUrl: config.apiUrl,
    denyList: [],
    extensionStatus: 'allGood',
    hostname: '',
    loading: false,
    loggingEnabled: true,
    loggingStyle: config.loggingStyle,
    loggingType: config.loggingType,
    socialMediaSites: config.socialMediaSites,
    theme: config.theme,
    trackSocialMedia: config.trackSocialMedia,
  });

  const loggingStyleRef = useRef(null);

  const restoreSettings = async (): Promise<void> => {
    const settings = await getSettings();
    setState({
      ...state,
      ...settings,
    });
  };

  useEffect(() => {
    void restoreSettings();
  }, []);

  const handleSubmit = async () => {
    if (state.loading) return;
    setState({ ...state, loading: true });
    if (state.apiUrl.endsWith('/')) {
      state.apiUrl = state.apiUrl.slice(0, -1);
    }
    await saveSettings({
      allowList: state.allowList,
      apiKey: state.apiKey,
      apiUrl: state.apiUrl,
      denyList: state.denyList,
      extensionStatus: state.extensionStatus,
      hostname: state.hostname,
      loggingEnabled: state.loggingEnabled,
      loggingStyle: state.loggingStyle,
      loggingType: state.loggingType,
      socialMediaSites: state.socialMediaSites,
      theme: state.theme,
      trackSocialMedia: state.trackSocialMedia,
    });
    setState(state);
    await logUserIn(state.apiKey);
    if (IS_CHROME) {
      window.close();
    }
  };

  const updateDenyListState = (sites: string) => {
    setState({
      ...state,
      denyList: sites.trim().split('\n'),
    });
  };

  const updateAllowListState = (sites: string) => {
    setState({
      ...state,
      allowList: sites.trim().split('\n'),
    });
  };

  const updateLoggingStyle = (style: string) => {
    setState({
      ...state,
      loggingStyle: style === 'allow' ? 'allow' : 'deny',
    });
  };

  const updateLoggingType = (type: string) => {
    setState({
      ...state,
      loggingType: type === 'url' ? 'url' : 'domain',
    });
  };

  const updateTheme = (theme: string) => {
    setState({
      ...state,
      theme: theme === 'light' ? 'light' : 'dark',
    });
  };

  const toggleSocialMedia = () => {
    setState({ ...state, trackSocialMedia: !state.trackSocialMedia });
  };

  const loggingStyle = function () {
    // TODO: rewrite SitesList to be structured inputs instead of textarea

    if (state.loggingStyle == 'deny') {
      return (
        <SitesList
          handleChange={updateDenyListState}
          label="Exclude"
          sites={state.denyList.join('\n')}
          helpText="Sites that you don't want to show in your reports."
        />
      );
    }
    return (
      <SitesList
        handleChange={updateAllowListState}
        label="Include"
        sites={state.allowList.join('\n')}
        placeholder="http://google.com&#10;http://myproject.com/MyProject"
        helpText="Only track these sites. You can assign URL to project by adding @@YourProject at the end of line."
      />
    );
  };

  const isApiKeyValid = apiKeyInvalid(state.apiKey) === '';

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <form className="form-horizontal">
            <div className="form-group mb-4">
              <label htmlFor="apiKey" className="form-label mb-0">
                API Key
              </label>
              <input
                id="apiKey"
                autoFocus={true}
                type="text"
                className={`form-control ${isApiKeyValid ? '' : 'is-invalid'}`}
                placeholder="API key"
                value={state.apiKey}
                onChange={(e) => setState({ ...state, apiKey: e.target.value })}
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="loggingStyle" className="form-label">
                Logging style
              </label>
              <select
                id="loggingStyle"
                ref={loggingStyleRef}
                className="form-control"
                value={state.loggingStyle}
                onChange={(e) => updateLoggingStyle(e.target.value)}
              >
                <option value="denyList">All except excluded sites</option>
                <option value="allowList">Only allowed sites</option>
              </select>
            </div>

            {loggingStyle()}

            <div className="form-group mb-4">
              <label htmlFor="loggingType" className="form-label">
                Logging type
              </label>
              <select
                id="loggingType"
                className="form-control"
                value={state.loggingType}
                onChange={(e) => updateLoggingType(e.target.value)}
              >
                <option value="domain">Only the domain</option>
                <option value="url">Entire URL</option>
              </select>
            </div>

            <div className="form-group mb-4">
              <label htmlFor="selectTheme" className="form-label mb-0">
                Theme
              </label>
              <select
                id="selectTheme"
                className="form-control"
                value={state.theme}
                onChange={(e) => updateTheme(e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className="form-group mb-4">
              <label htmlFor="selectHost" className="form-label mb-0">
                Hostname
              </label>
              <input
                id="selectHost"
                type="text"
                className="form-control"
                value={state.hostname}
                onChange={(e) => setState({ ...state, hostname: e.target.value })}
              />
              <span className="text-secondary">
                Optional name of local machine. By default &apos;Unknown Hostname&apos;.
              </span>
            </div>

            <div className="form-group mb-4">
              <label htmlFor="apiUrl" className="form-label mb-0">
                API Url
              </label>

              <input
                id="apiUrl"
                type="text"
                className="form-control"
                value={state.apiUrl}
                onChange={(e) => setState({ ...state, apiUrl: e.target.value })}
                placeholder="https://api.wakatime.com/api/v1"
              />
              <span className="help-block">https://api.wakatime.com/api/v1</span>
            </div>

            <div className="form-group row mb-4">
              <div className="col-lg-10 col-lg-offset-2 space-between align-items-center">
                <div>
                  <input
                    type="checkbox"
                    className="me-2"
                    checked={state.trackSocialMedia}
                    onChange={toggleSocialMedia}
                  />
                  <span onClick={toggleSocialMedia}>Track social media sites</span>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#socialSitesModal"
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
                        <h4 className="modal-title fs-5" id="socialSitesModalLabel">
                          Social Media Sites
                        </h4>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
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
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group mb-4">
              <div className="d-grid gap-2 col-6 ">
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
