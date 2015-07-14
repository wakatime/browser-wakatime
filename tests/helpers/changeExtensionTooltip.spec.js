import changeExtensionTooltip from '../../assets/js/helpers/changeExtensionTooltip';

describe('changeExtensionTooltip', function() {
    it('should be a function', function() {
        expect(changeExtensionTooltip).to.be.a('function');
    });

    it('should change the extension tooltip', function() {
    	// Need to attach the spy first
    	spyOn(chrome.browserAction, 'setTitle');
        changeExtensionTooltip('WakaTime');
        expect(chrome.browserAction.setTitle).toHaveBeenCalledWith({title: 'Wakatime'});
        // sinon.assert.calledWithMatch(chrome.browserAction.setTitle, {title: 'WakaTime'});
    });
});