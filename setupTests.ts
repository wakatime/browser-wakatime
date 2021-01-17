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
