var chai = require('chai');
var expect = chai.expect;

import contains from '../../assets/js/helpers/contains';

describe('contains', function() {
    it('should be a function', function() {
        expect(contains).to.be.a('function');
    });

    it('should find the line and return true', function() {

        var list = ".app\ntest.com";

        expect(contains('.app', list)).to.equal(true);
    });

    it('should not find the line and it should return false', function() {

        var list = ".app\ntest.com";

        expect(contains('.app2', list)).to.equal(false);
    });
});