import chai from 'chai';
import changeExtensionIcon from '../../src/utils/changeExtensionIcon';

const expect = chai.expect;

jest.mock('webextension-polyfill', () => {
  return {
    runtime: {
      getManifest: () => {
        return { version: 'test-version' };
      },
    },
  };
});

describe('changeExtensionIcon', function () {
  it('should be a function', function () {
    expect(changeExtensionIcon).to.be.a('function');
  });
});
