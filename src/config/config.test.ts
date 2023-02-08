import config from './config';

jest.mock('webextension-polyfill', () => {
  return {
    runtime: {
      getManifest: () => {
        return { version: 'test-version' };
      },
    },
  };
});

describe('wakatime config', () => {
  it('snapshot of config', () => {
    expect(config).toMatchInlineSnapshot(`
      {
        "alert": {
          "failure": {
            "text": "There was an error while saving the options!",
            "type": "danger",
          },
          "success": {
            "text": "Options have been saved!",
            "type": "success",
          },
        },
        "apiKey": "",
        "colors": {
          "allGood": "",
          "lightTheme": "white",
          "notLogging": "gray",
          "notSignedIn": "red",
        },
        "currentUserApiUrl": "https://wakatime.com/api/v1/users/current",
        "detectionIntervalInSeconds": 60,
        "devSites": "https://codepen.io/
      https://www.codewars.com/
      https://dev.to/
      https://github.com/
      https://www.hackerrank.com/
      https://leetcode.com/
      https://developer.mozilla.org/en-US/
      https://stackoverflow.com/
      https://www.udemy.com/
      https://www.w3schools.com/",
        "heartbeatApiUrl": "https://wakatime.com/api/v1/users/current/heartbeats",
        "loggingEnabled": true,
        "loggingStyle": "blacklist",
        "loggingType": "domain",
        "logoutUserUrl": "https://wakatime.com/logout",
        "name": "WakaTime",
        "socialMediaSites": "https://www.facebook.com/
      https://www.instagram.com/
      https://www.linkedin.com/
      https://www.pinterest.com/
      https://www.reddit.com/
      https://www.snapchat.com/
      https://www.tiktok.com/
      https://twitter.com/
      https://www.whatsapp.com/
      https://www.youtube.com/",
        "states": [
          "allGood",
          "notLogging",
          "notSignedIn",
          "blacklisted",
          "whitelisted",
        ],
        "summariesApiUrl": "https://wakatime.com/api/v1/users/current/summaries",
        "theme": "light",
        "tooltips": {
          "allGood": "",
          "blacklisted": "This URL is blacklisted",
          "notLogging": "Not logging",
          "notSignedIn": "Not signed In",
          "whitelisted": "This URL is not on your whitelist",
        },
        "trackSocialMedia": true,
        "version": "test-version",
      }
    `);
  });
});
