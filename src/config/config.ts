import browser from 'webextension-polyfill';

/**
 * Logging
 */
export type ExtensionStatus = 'allGood' | 'trackingDisabled' | 'notSignedIn' | 'ignored';
/**
 * Supported logging style
 */
export type LoggingStyle = 'allow' | 'deny';

/**
 * Logging type
 */
export type LoggingType = 'domain' | 'url';
export type SuccessOrFailType = 'success' | 'danger';
export type Theme = 'light' | 'dark';
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
  allGood: '';
  lightTheme: 'white';
  notSignedIn: 'red';
  trackingDisabled: 'gray';
}
/**
 * Tooltip messages
 */
interface Tooltips {
  allGood: string;
  ignored: string;
  notSignedIn: string;
  trackingDisabled: string;
}

export interface Config {
  alert: Alert;
  /**
   * API key use to query wakatime  api
   */
  apiKey: string;
  apiUrl: string;
  colors: Colors;
  /**
   * Url from which to detect if the user is logged in
   */
  currentUserApiEndPoint: string;
  /**
   * Time for idle state of the browser
   * The user is considered idle if there was
   * no activity in the browser for x second
   */
  detectionIntervalInSeconds: number;
  devSites: string[];

  /**
   * Url to which to send the heartbeat
   */
  heartbeatApiEndPoint: string;
  hostname: string;

  /**
   * Whether to log activity only for grouped tabs
   */
  logOnlyGroupedTabsActivity: boolean;
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
  nonTrackableSites: string[];
  queueName: string;
  socialMediaSites: string[];
  states: ExtensionStatus[];
  /**
   * Get stats from the wakatime api
   */
  summariesApiEndPoint: string;
  /**
   * Options for theme
   */
  theme: Theme;
  tooltips: Tooltips;

  trackSocialMedia: boolean;
  /**
   * Whether to use the tab group's name as project name
   * (if the tab is in a group)
   */
  useGroupNameAsProjectName: boolean;
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

  apiKey: '',

  apiUrl: process.env.API_URL ?? 'https://api.wakatime.com/api/v1',

  colors: {
    allGood: '',
    lightTheme: 'white',
    notSignedIn: 'red',
    trackingDisabled: 'gray',
  },

  currentUserApiEndPoint: process.env.CURRENT_USER_API_URL ?? '/users/current',

  detectionIntervalInSeconds: 60,

  devSites: [
    'codepen.io',
    'codewars.com',
    'dev.to',
    'github.com',
    'hackerrank.com',
    'leetcode.com',
    'developer.mozilla.org',
    'stackoverflow.com',
    'udemy.com',
    'w3schools.com',
  ],

  heartbeatApiEndPoint: process.env.HEARTBEAT_API_URL ?? '/users/current/heartbeats.bulk',

  hostname: '',

  logOnlyGroupedTabsActivity: false,

  loggingEnabled: true,

  loggingStyle: 'deny',

  loggingType: 'domain',

  logoutUserUrl: process.env.LOGOUT_USER_URL ?? 'https://wakatime.com/logout',

  name: 'WakaTime',

  nonTrackableSites: ['chrome://', 'about:'],

  queueName: 'heartbeatsQueue',

  socialMediaSites: [
    'facebook.com',
    'instagram.com',
    'linkedin.com',
    'pinterest.com',
    'reddit.com',
    'snapchat.com',
    'tiktok.com',
    'twitter.com',
    'whatsapp.com',
    'x.com',
    'youtube.com',
  ],

  states: ['allGood', 'trackingDisabled', 'notSignedIn', 'ignored'],

  summariesApiEndPoint: process.env.SUMMARIES_API_URL ?? '/users/current/summaries',

  theme: 'light',
  tooltips: {
    allGood: '',
    ignored: 'This URL is ignored',
    notSignedIn: 'Not signed In',
    trackingDisabled: 'Not logging',
  },

  trackSocialMedia: true,
  useGroupNameAsProjectName: false,

  version: browser.runtime.getManifest().version,
};

export default config;
