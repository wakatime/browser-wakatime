var chai = require('chai');
var expect = chai.expect;

import currentTimestamp from '../../assets/js/helpers/currentTimestamp';

describe('currentTimestamp', function() {
	it('should be a function', function() {
		expect(currentTimestamp).to.be.a('function');
	});
});	