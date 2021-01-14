var chai = require('chai');
var expect = chai.expect;

var changeExtensionIcon = require('../../assets/js/helpers/changeExtensionIcon');

describe('changeExtensionIcon', function () {
  it('should be a function', function () {
    expect(changeExtensionIcon).to.be.a('function');
  });
});
