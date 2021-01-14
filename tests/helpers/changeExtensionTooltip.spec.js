var chai = require('chai');
var sinon = require('sinon-chai');
var chrome = require('sinon-chrome');
var expect = chai.expect;

var changeExtensionTooltip = require('../../assets/js/helpers/changeExtensionTooltip');
describe('changeExtensionTooltip', function () {
  it('should be a function', function () {
    expect(changeExtensionTooltip).to.be.a('function');
  });

  // it('should change the extension tooltip', function() {
  //     changeExtensionTooltip('WakaTime');
  //     expect(chrome.browserAction.setTitle).toHaveBeenCalledWith({title: 'Wakatime'});
  //     sinon.assert.calledWithMatch(chrome.browserAction.setTitle, {title: 'WakaTime'});
  // });
});
