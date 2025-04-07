# browser-wakatime

Automatic time tracking for stats about your website debugging, research, documentation, etc.

Note: Activity from this browser extension will not display on leaderboards, so installing this extension may lower your rank.

## Installation

1. Install the extension:

[![Chrome](https://wakatime.com/static/img/chrome-web-store.png)](https://chrome.google.com/webstore/detail/wakatime/jnbbnacmeggbgdjgaoojpmhdlkkpblgi)

[![Firefox](https://wakatime.com/static/img/firefox-addon.png)](https://addons.mozilla.org/en-US/firefox/addon/wakatimes/)

[![Edge](https://wakatime.com/static/img/microsoft-extension.png)](https://microsoftedge.microsoft.com/addons/detail/wakatime/cdnpfnaadjmaplhghnlonephmabegadl)

2. Login to [WakaTime](https://wakatime.com/).

3. Use your browser like you normally do and your time will be tracked for you automatically.

4. Visit https://wakatime.com to see your logged time.

5. Use in conjunction with [other WakaTime plugins](https://wakatime.com/plugins).

## Screenshots

![SC open](./screenshots/sc_6-green.png)

![SC open](./screenshots/sc_6-open.png)

## Development instructions

```
npm i --include=dev
npm run dev
```

Run tests:

```
npm test
```

### Troubleshooting

Check for errors by inspecting the extension.

![inspecting extension](./screenshots/wakatime-chrome-debug.gif)

The extension is going through a refactor, the new build [instructions are here](./DEVELOPMENT.md)
