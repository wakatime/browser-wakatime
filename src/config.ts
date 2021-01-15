const config = {
  // Predefined alert type and text for success and failure.
  alert: {
    failure: {
      text: 'There was an error while saving the options!',
      type: 'danger',
    },
    success: {
      text: 'Options have been saved!',
      type: 'success',
    },
  },

  // Different colors for different states of the extension
  colors: {
    allGood: '',
    lightTheme: 'white',
    notLogging: 'gray',
    notSignedIn: 'red',
  },

  // Url from which to detect if the user is logged in
  currentUserApiUrl: 'https://wakatime.com/api/v1/users/current',

  /*
   * Time for idle state of the browser
   * The user is considered idle if there was
   * no activity in the browser for x seconds
   */
  detectionIntervalInSeconds: 60,

  // Url to which to send the heartbeat
  heartbeatApiUrl: 'https://wakatime.com/api/v1/users/current/heartbeats',

  // By default logging is enabled
  loggingEnabled: true,

  /*
   * Default logging style
   * Log all except blacklisted sites
   * or log only the white listed sites.
   */
  loggingStyle: 'blacklist',

  // Default logging type
  loggingType: 'domain',

  // The url to logout the user from wakatime
  logoutUserUrl: 'https://wakatime.com/logout',

  // Extension name
  name: 'WakaTime',

  // Valid extension states
  states: ['allGood', 'notLogging', 'notSignedIn', 'blacklisted', 'whitelisted'],

  // Gets stats from the WakaTime API
  summariesApiUrl: 'https://wakatime.com/api/v1/users/current/summaries',

  // Default theme
  theme: 'light',

  // Tooltips for each of the extension states
  tooltips: {
    allGood: '',
    blacklisted: 'This URL is blacklisted',
    notLogging: 'Not logging',
    notSignedIn: 'Not signed In',
    whitelisted: 'This URL is not on your whitelist',
  },

  // Extension version
  version: process.env.NODE_ENV === 'test' ? 'test' : browser.runtime.getManifest().version,
};

export default config;
