var chai = require('chai');
var expect = chai.expect;

import in_array from '../../assets/js/helpers/in_array';

describe('in_array', function() {
    it('should be a function', function() {
        expect(in_array).to.be.a('function');
    });
});