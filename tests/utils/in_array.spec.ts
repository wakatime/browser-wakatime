import chai from 'chai';
import inArray from '../../src/utils/inArray';

const expect = chai.expect;

describe('inArray', function () {
  it('should be a function', function () {
    expect(inArray).to.be.a('function');
  });

  it('should find the needle and return true', function () {
    expect(inArray('4', ['4', '3', '2', '1'])).to.equal(true);
  });

  it('should not find the needle and it should return false', function () {
    expect(inArray('5', ['4', '3', '2', '1'])).to.equal(false);
  });
});
