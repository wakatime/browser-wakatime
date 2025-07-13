import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import config, { SuccessOrFailType } from '../config/config';
import apiKeyInvalid from '../utils/apiKey';
import { IS_CHROME, IS_OPERA, IS_YANDEX } from '../utils/operatingSystem';
import {
  getSettings,
  ProjectName,
  saveSettings,
  Settings,
  YaBrowserSpaceNameMatch,
} from '../utils/settings';
import { logUserIn } from '../utils/user';
import CustomProjectNameList from './CustomProjectNameList';
import SitesList from './SitesList';
import YaBrowserSpaceNameMatchList from './YaBrowserSpaceNameMatchList';

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
    customProjectNames: [],
    denyList: [],
    extensionStatus: 'allGood',
    hostname: '',
    loading: false,
    logOnlyGroupedTabsActivity: config.logOnlyGroupedTabsActivity,
    loggingEnabled: true,
    loggingStyle: config.loggingStyle,
    loggingType: config.loggingType,
    socialMediaSites: config.socialMediaSites,
    theme: config.theme,
    trackSocialMedia: config.trackSocialMedia,
    useGroupNameAsProjectName: config.useGroupNameAsProjectName,
    yaBrowserSpaceNameMatch: {},
  });

  const isApiKeyValid = useMemo(() => apiKeyInvalid(state.apiKey) === '', [state.apiKey]);

  const loggingStyleRef = useRef(null);

  const restoreSettings = useCallback(async () => {
    const settings = await getSettings();
    setState((oldState) => ({
      ...oldState,
      ...settings,
    }));
  }, []);

  useEffect(() => {
    void restoreSettings();
  }, [restoreSettings]);

  const handleSubmit = async () => {
    if (state.loading) return;
    setState((oldState) => ({ ...oldState, loading: true }));
    await saveSettings({
      allowList: state.allowList.filter((item) => !!item.trim()),
      apiKey: state.apiKey,
      apiUrl: state.apiUrl,
      customProjectNames: state.customProjectNames.filter(
        (item) => !!item.url.trim() && !!item.projectName.trim(),
      ),
      denyList: state.denyList.filter((item) => !!item.trim()),
      extensionStatus: state.extensionStatus,
      hostname: state.hostname,
      logOnlyGroupedTabsActivity: state.logOnlyGroupedTabsActivity,
      loggingEnabled: state.loggingEnabled,
      loggingStyle: state.loggingStyle,
      loggingType: state.loggingType,
      socialMediaSites: state.socialMediaSites.filter((item) => !!item.trim()),
      theme: state.theme,
      trackSocialMedia: state.trackSocialMedia,
      useGroupNameAsProjectName: state.useGroupNameAsProjectName,
      yaBrowserSpaceNameMatch: state.yaBrowserSpaceNameMatch,
    });
    setState(state);
    await logUserIn(state.apiKey);
    if (IS_CHROME) {
      window.close();
    }
  };

  const updateDenyListState = useCallback((denyList: string[]) => {
    setState((oldState) => ({
      ...oldState,
      denyList,
    }));
  }, []);

  const updateAllowListState = useCallback((allowList: string[]) => {
    setState((oldState) => ({
      ...oldState,
      allowList,
    }));
  }, []);

  const updateCustomProjectNamesState = useCallback((customProjectNames: ProjectName[]) => {
    setState((oldState) => ({
      ...oldState,
      customProjectNames,
    }));
  }, []);

  const updateYaBrowserSpaceNameMatchState = useCallback(
    (yaBrowserSpaceNameMatch: YaBrowserSpaceNameMatch) => {
      setState((oldState) => ({
        ...oldState,
        yaBrowserSpaceNameMatch,
      }));
    },
    [],
  );

  const updateLoggingStyle = useCallback((style: string) => {
    setState((oldState) => ({
      ...oldState,
      loggingStyle: style === 'allow' ? 'allow' : 'deny',
    }));
  }, []);

  const updateLoggingType = useCallback((type: string) => {
    setState((oldState) => ({
      ...oldState,
      loggingType: type === 'url' ? 'url' : 'domain',
    }));
  }, []);

  const updateTheme = useCallback((theme: string) => {
    setState((oldState) => ({
      ...oldState,
      theme: theme === 'light' ? 'light' : 'dark',
    }));
  }, []);

  const toggleSocialMedia = useCallback(() => {
    setState((oldState) => ({
      ...oldState,
      trackSocialMedia: !oldState.trackSocialMedia,
    }));
  }, []);

  const toggleUseGroupNameAsProjectName = useCallback(() => {
    setState((oldState) => ({
      ...oldState,
      useGroupNameAsProjectName: !oldState.useGroupNameAsProjectName,
    }));
  }, []);

  const toggleLogOnlyGroupedTabsActivity = useCallback(() => {
    setState((oldState) => ({
      ...oldState,
      logOnlyGroupedTabsActivity: !oldState.logOnlyGroupedTabsActivity,
    }));
  }, []);

  const loggingStyle = useCallback(() => {
    // TODO: rewrite SitesList to be structured inputs instead of textarea

    if (state.loggingStyle == 'deny') {
      return (
        <SitesList
          handleChange={updateDenyListState}
          label="Exclude"
          sites={state.denyList}
          helpText="Sites that you don't want to show in your reports."
        />
      );
    }
    return (
      <SitesList
        handleChange={updateAllowListState}
        label="Include"
        sites={state.allowList}
        projectNamePlaceholder="http://google.com&#10;http://myproject.com/MyProject"
        helpText="Only track these sites."
      />
    );
  }, [
    state.allowList,
    state.denyList,
    state.loggingStyle,
    updateAllowListState,
    updateDenyListState,
  ]);

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
                <option value="deny">All except excluded sites</option>
                <option value="allow">Only allowed sites</option>
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

            <CustomProjectNameList
              sites={state.customProjectNames}
              label="Custom Project Names"
              handleChange={updateCustomProjectNamesState}
              helpText=""
            />

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

            <div className="form-group mb-4">
              <label className="form-label mb-0">Tab Groups</label>

              <div>
                <input
                  type="checkbox"
                  className="me-2"
                  checked={state.useGroupNameAsProjectName}
                  onChange={toggleUseGroupNameAsProjectName}
                />
                <span onClick={toggleUseGroupNameAsProjectName}>
                  Use tab&apos;s group name as project name
                </span>
              </div>

              <div>
                <input
                  disabled={IS_OPERA}
                  type="checkbox"
                  className="me-2"
                  checked={state.logOnlyGroupedTabsActivity}
                  onChange={toggleLogOnlyGroupedTabsActivity}
                />
                <span onClick={toggleLogOnlyGroupedTabsActivity}>
                  Log only grouped tabs activity
                </span>
              </div>

              {IS_YANDEX && (
                <details>
                  <summary style={{ color: 'red' }}>
                    Required extra setup for Yandex Browser!
                  </summary>

                  <YaBrowserSpaceNameMatchList
                    value={state.yaBrowserSpaceNameMatch}
                    onChange={updateYaBrowserSpaceNameMatchState}
                  />
                </details>
              )}

              {IS_OPERA && (
                <span style={{ color: 'red' }}>
                  {
                    'Be sure to use workspaces, not tab islands, because tab islands have no names. '
                  }
                  {"That's why at the moment only workspaces are supported in Opera Browser. "}
                  {
                    'Also be aware that in Opera every tab is in a workspace(either the default one, or created by you). '
                  }
                  {
                    'That\'s why the "Log only grouped tabs activity" checkbox is disabled in Opera. It will have no effect'
                  }
                </span>
              )}
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
                        />
                      </div>
                      <div className="modal-body">
                        <SitesList
                          handleChange={(socialMediaSites) => {
                            setState((oldState) => ({
                              ...oldState,
                              socialMediaSites,
                            }));
                          }}
                          label="Social"
                          sites={state.socialMediaSites}
                          helpText="Sites that you don't want to show in your reports."
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
