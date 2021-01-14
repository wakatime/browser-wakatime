var chai = require('chai');
var expect = chai.expect;

var contains = require('../../assets/js/helpers/contains');

describe('contains', function () {
  it('should be a function', function () {
    expect(contains).to.be.a('function');
  });

  it('should match url against blacklist and return true', function () {
    var list = 'localhost\ntest.com';

    var url = 'http://localhost/fooapp';
    expect(contains(url, list)).to.equal(true);
  });

  it('should not match url against blacklist and return false', function () {
    var list = 'localhost2\ntest.com';

    var url = 'http://localhost/fooapp';
    expect(contains(url, list)).to.equal(false);
  });
});
