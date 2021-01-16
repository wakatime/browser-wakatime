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

export const browser = new BrowserMock();

export default { browser };
