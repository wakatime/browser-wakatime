var chai = require('chai');
var expect = chai.expect;

import changeExtensionTooltip from '../../assets/js/helpers/changeExtensionTooltip';

describe('changeExtensionTooltip', function() {
    it('should be a function', function() {
        expect(changeExtensionTooltip).to.be.a('function');
    });
});