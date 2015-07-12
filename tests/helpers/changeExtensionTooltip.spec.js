var chai = require('chai');
var sinon = require('sinon');
var chrome = require('sinon-chrome');
var expect = chai.expect;

import changeExtensionTooltip from '../../assets/js/helpers/changeExtensionTooltip';

describe('changeExtensionTooltip', function() {
    it('should be a function', function() {
        expect(changeExtensionTooltip).to.be.a('function');
    });

    it('should change the extension tooltip', function() {
        changeExtensionTooltip('WakaTime');

        sinon.assert.calledWithMatch(chrome.browserAction.setTitle, {title: 'WakaTime'});
    });
});