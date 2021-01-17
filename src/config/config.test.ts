import config from './config';

describe('wakatime config', () => {
  it('snapshot of config', () => {
    expect(config).toMatchInlineSnapshot(`
      Object {
        "alert": Object {
          "failure": Object {
            "text": "There was an error while saving the options!",
            "type": "danger",
          },
          "success": Object {
            "text": "Options have been saved!",
            "type": "success",
          },
        },
        "colors": Object {
          "allGood": "",
          "lightTheme": "white",
          "notLogging": "gray",
          "notSignedIn": "red",
        },
        "currentUserApiUrl": "https://wakatime.com/api/v1/users/current",
        "detectionIntervalInSeconds": 60,
        "heartbeatApiUrl": "https://wakatime.com/api/v1/users/current/heartbeats",
        "loggingEnabled": true,
        "loggingStyle": "blacklist",
        "loggingType": "domain",
        "logoutUserUrl": "https://wakatime.com/logout",
        "name": "WakaTime",
        "states": Array [
          "allGood",
          "notLogging",
          "notSignedIn",
          "blacklisted",
          "whitelisted",
        ],
        "summariesApiUrl": "https://wakatime.com/api/v1/users/current/summaries",
        "theme": "light",
        "tooltips": Object {
          "allGood": "",
          "blacklisted": "This URL is blacklisted",
          "notLogging": "Not logging",
          "notSignedIn": "Not signed In",
          "whitelisted": "This URL is not on your whitelist",
        },
        "version": "test-version",
      }
    `);
  });
});
