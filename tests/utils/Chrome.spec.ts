const sinon = require('sinon/pkg/sinon.js');
import chrome from 'sinon-chrome';

describe('Chrome Dev Tools', function () {
  it('should work', async function () {
    chrome.browserAction.setTitle({ title: 'hello' });
    sinon.assert.calledOnce(chrome.browserAction.setTitle);
  });
});
