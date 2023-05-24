import chai from 'chai';
import changeExtensionState from '../../src/utils/changeExtensionState';

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

describe('changeExtensionState', function () {
  it('should be a function', function () {
    expect(changeExtensionState).to.be.a('function');
  });
});
