var chai = require('chai');
var expect = chai.expect;

import contains from '../../assets/js/helpers/contains';

describe('contains', function() {
    it('should be a function', function() {
        expect(contains).to.be.a('function');
    });
});