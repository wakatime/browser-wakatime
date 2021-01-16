import { browser } from 'webextension-polyfill-ts';

/**
 * Logging
 */
type ApiStates = 'allGood' | 'notLogging' | 'notSignedIn' | 'blacklisted' | 'whitelisted';
/**
 * Supported logging style
 */
type LoggingStyle = 'whitelist' | 'blacklist';
/**
 * Logging type
 */
type LoggingType = 'domain' | 'url';
type SuccessOrFailType = 'success' | 'danger';
/**
 * Predefined alert type and text for success and failure.
 */
interface Alert {
  failure: SuccessOrFailAlert;
  success: SuccessOrFailAlert;
}
/**
 * Define what a sucess or failure shape looks like
 */
interface SuccessOrFailAlert {
  text: string;
  type: SuccessOrFailType;
}
/**
 *  Different colors for different states of the extension
 */
interface Colors {
  allGood: string;
  lightTheme: string;
  notLogging: string;
  notSignedIn: string;
}
/**
 * Tooltip messages
 */
interface Tooltips {
  allGood: string;
  blacklisted: string;
  notLogging: string;
  notSignedIn: string;
  whitelisted: string;
}

export interface Config {
  alert: Alert;
  colors: Colors;
  /**
   * Url from which to detect if the user is logged in
   */
  currentUserApiUrl: string;
  /**
   * Time for idle state of the browser
   * The user is considered idle if there was
   * no activity in the browser for x second
   */
  detectionIntervalInSeconds: number;
  /**
   * Url to which to send the heartbeat
   */
  heartbeatApiUrl: string;
  /**
   * Is logging enabled
   */
  loggingEnabled: boolean;
  loggingStyle: LoggingStyle;
  loggingType: LoggingType;
  /**
   * Url to logout out of wakatime
   */
  logoutUserUrl: string;
  /**
   * Extension name
   */
  name: string;
  states: ApiStates[];
  /**
   * Get stats from the wakatime api
   */
  summariesApiUrl: string;
  /**
   * Options for theme
   */
  theme: 'light';
  tooltips: Tooltips;
  /**
   * Version of the extension
   */
  version: string;
}

const config: Config = {
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

  colors: {
    allGood: '',
    lightTheme: 'white',
    notLogging: 'gray',
    notSignedIn: 'red',
  },

  currentUserApiUrl: 'https://wakatime.com/api/v1/users/current',

  detectionIntervalInSeconds: 60,

  heartbeatApiUrl: 'https://wakatime.com/api/v1/users/current/heartbeats',

  loggingEnabled: true,

  loggingStyle: 'blacklist',

  loggingType: 'domain',

  logoutUserUrl: 'https://wakatime.com/logout',

  name: 'WakaTime',

  states: ['allGood', 'notLogging', 'notSignedIn', 'blacklisted', 'whitelisted'],

  summariesApiUrl: 'https://wakatime.com/api/v1/users/current/summaries',

  theme: 'light',

  tooltips: {
    allGood: '',
    blacklisted: 'This URL is blacklisted',
    notLogging: 'Not logging',
    notSignedIn: 'Not signed In',
    whitelisted: 'This URL is not on your whitelist',
  },

  version: browser.runtime.getManifest().version,
};

export default config;
