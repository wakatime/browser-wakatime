var chai = require('chai');
var expect = chai.expect;

var in_array = require('../../assets/js/helpers/in_array');

describe('in_array', function () {
  it('should be a function', function () {
    expect(in_array).to.be.a('function');
  });

  it('should find the needle and return true', function () {
    expect(in_array('4', ['4', '3', '2', '1'])).to.equal(true);
  });

  it('should not find the needle and it should return false', function () {
    expect(in_array('5', ['4', '3', '2', '1'])).to.equal(false);
  });
});
