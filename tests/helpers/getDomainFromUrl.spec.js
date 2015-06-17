var chai = require('chai');
var expect = chai.expect;

import getDomainFromUrl from '../../assets/js/helpers/getDomainFromUrl';

describe('getDomainFromUrl', function() {
    it('should be a function', function() {
        expect(getDomainFromUrl).to.be.a('function');
    });
});