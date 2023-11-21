import browser from 'webextension-polyfill';

/**
 * Logging
 */
export type ApiStates = 'allGood' | 'notLogging' | 'notSignedIn' | 'blacklisted' | 'whitelisted';
/**
 * Supported logging style
 */
export type LoggingStyle = 'whitelist' | 'blacklist';
/**
 * Logging type
 */
export type LoggingType = 'domain' | 'url';
export type SuccessOrFailType = 'success' | 'danger';
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
  notLogging: 'gray';
  notSignedIn: 'red';
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
  /**
   * API key use to query wakatime  api
   */
  apiKey: '';
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
  socialMediaSites: string[];
  states: ApiStates[];
  /**
   * Get stats from the wakatime api
   */
  summariesApiEndPoint: string;
  /**
   * Options for theme
   */
  theme: 'light';
  tooltips: Tooltips;
  trackSocialMedia: boolean;
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
    notLogging: 'gray',
    notSignedIn: 'red',
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

  heartbeatApiEndPoint: process.env.HEARTBEAT_API_URL ?? '/users/current/heartbeats',

  hostname: '',

  loggingEnabled: true,

  loggingStyle: 'blacklist',

  loggingType: 'domain',

  logoutUserUrl: process.env.LOGOUT_USER_URL ?? 'https://wakatime.com/logout',

  name: 'WakaTime',

  nonTrackableSites: ['chrome://', 'about:'],

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
    'youtube.com',
  ],

  states: ['allGood', 'notLogging', 'notSignedIn', 'blacklisted', 'whitelisted'],

  summariesApiEndPoint: process.env.SUMMARIES_API_URL ?? '/users/current/summaries',

  theme: 'light',

  tooltips: {
    allGood: '',
    blacklisted: 'This URL is blacklisted',
    notLogging: 'Not logging',
    notSignedIn: 'Not signed In',
    whitelisted: 'This URL is not on your whitelist',
  },
  trackSocialMedia: true,

  version: browser.runtime.getManifest().version,
};

export default config;
