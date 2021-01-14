var chai = require('chai');
var expect = chai.expect;

var changeExtensionState = require('../../assets/js/helpers/changeExtensionState');

describe('changeExtensionState', function () {
  beforeEach(() => {
    browser = window;
  });
  it('should be a function', function () {
    expect(changeExtensionState).to.be.a('function');
  });
});
