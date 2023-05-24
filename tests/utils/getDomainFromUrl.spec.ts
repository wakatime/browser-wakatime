import chai from 'chai';
import getDomainFromUrl from '../../src/utils/getDomainFromUrl';

const expect = chai.expect;

describe('getDomainFromUrl', function () {
  it('should be a function', function () {
    expect(getDomainFromUrl).to.be.a('function');
  });

  it('should return the domain', function () {
    expect(getDomainFromUrl('http://google.com/something/very/secret')).to.equal(
      'http://google.com',
    );

    expect(getDomainFromUrl('http://www.google.com/something/very/secret')).to.equal(
      'http://www.google.com',
    );

    // This is not how it was imaged to work, but let's leave it here as a warning.
    expect(getDomainFromUrl('google.com/something/very/secret')).to.equal('google.com//very');
  });
});
