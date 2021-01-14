var chai = require('chai');
var sinon = require('sinon');
var chrome = require('sinon-chrome');
var expect = chai.expect;

describe('Chrome Dev Tools', function () {
  it('should work', function () {
    chrome.browserAction.setTitle({ title: 'hello' });
    sinon.assert.calledOnce(chrome.browserAction.setTitle);
  });
});
