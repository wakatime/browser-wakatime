var chai = require('chai');
var expect = chai.expect;

import getTodaysDateInFormat from '../../assets/js/helpers/getTodaysDateInFormat';

describe('getTodaysDateInFormat', function() {
    it('should be a function', function() {
        expect(getTodaysDateInFormat).to.be.a('function');
    });

    it('should return todays date in format YYYY-MM-DD', function() {
        expect(getTodaysDateInFormat()).to.be('2015-06-14');
    });
});
