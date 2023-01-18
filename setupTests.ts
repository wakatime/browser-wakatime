import '@testing-library/jest-dom/extend-expect';
import chrome from 'sinon-chrome';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
window.chrome = chrome;

chrome.runtime.id = 'testid'; // https://github.com/mozilla/webextension-polyfill/issues/218#issuecomment-584936358

class BrowserMock {
  runtime = {
    getBackgroundPage() {
      return 'https://background-page.html';
    },
    getManifest() {
      return {
        version: 'test-version',
      };
    },
    openOptionsPage() {
      return 'https://options-page.html';
    },
  };
}
//TODO: Improve mocking
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
window.browser = new BrowserMock();
