import chai from 'chai';
import contains from '../../src/utils/contains';

const expect = chai.expect;

describe('contains', function () {
  it('should be a function', function () {
    expect(contains).to.be.a('function');
  });

  it('should match url against blacklist and return true', function () {
    const list = 'localhost\ntest.com';

    const url = 'http://localhost/fooapp';
    expect(contains(url, list)).to.equal(true);
  });

  it('should not match url against blacklist and return false', function () {
    const list = 'localhost2\ntest.com';

    const url = 'http://localhost/fooapp';
    expect(contains(url, list)).to.equal(false);
  });
});
