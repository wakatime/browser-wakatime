chrome-wakatime
===============

Automatic time tracking for stats about your website debugging, research, documentation, etc.


##Installation

1. Install the extension:

[![Chrome Web Store](https://wakatime.com/static/img/chrome-web-store.png)](https://chrome.google.com/webstore/detail/wakatime/jnbbnacmeggbgdjgaoojpmhdlkkpblgi)

2. Login to [WakaTime](https://wakatime.com/).

3. Use Chrome like you normally do and your time will be tracked for you automatically.

4. Visit https://wakatime.com to see your logged time.

5. Use in conjunction with [other WakaTime plugins](https://wakatime.com/plugins).


## Screenshots

![SC open](./screenshots/sc_6-green.png)

![SC open](./screenshots/sc_6-open.png)

![Options SC](./screenshots/sc_8-options.png)


## Development instructions

> For development purposes only.

To get started, install NPM and Bower dependencies, and do an initial build with Gulp:
```
npm start
```

To build the extension once:

```
npm run gulp
```

To monitor changes:

```
npm run watch
```

Run tests:

```
npm test
```

Lint code *(Both JS and JSX)*:

```
jsxhint --jsx-only .
```

### Automatic code linting

There is a precommit hook that lints the code before commiting the changes.


### Load unpacked in Chrome

1. Clone repository to disk
2. Go to `Settings` -> `Extensions`
3. Enable `Developer mode`
4. Click `Load unpacked extension...`
5. Select repository directory
