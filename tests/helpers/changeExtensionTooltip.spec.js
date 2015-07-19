// var chai = require('chai');
// var chrome = require('sinon-chrome');
// var sinon = require('sinon-chai');
// var expect = chai.expect;

// import changeExtensionTooltip from '../../assets/js/helpers/changeExtensionTooltip';

// describe('changeExtensionTooltip', function() {
//     it('should be a function', function() {
//         expect(changeExtensionTooltip).to.be.a('function');
//     });

//     it('should change the extension tooltip', function() {
//         changeExtensionTooltip('WakaTime');
//         expect(chrome.browserAction.setTitle).toHaveBeenCalledWith({title: 'Wakatime'});
//         sinon.assert.calledWithMatch(chrome.browserAction.setTitle, {title: 'WakaTime'});
//     });
// });

var babel 

describe('changeExtensionTooltip', function() {
	// sometimes it takes time to start phantomjs
	this.timeout(4000);

	var FILENAME = 'tests/empty.html';

	it('should exist', function(done) {
		page.open(FILENAME, function() {
			page.injectJs('assets/js/helpers/changeExtensionTooltip.js');
		
			page.evaluate(function() {
				console.log(typeof changeExtensionIcon);
			});
			done();
		});
	});
});