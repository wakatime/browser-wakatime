jest.dontMock('../../assets/js/components/Options.jsx');

describe('Options', function () {
  var React, Options, TestUtils, Component;

  beforeEach(function () {
    // Setup our tools
    React = require('react/addons');
    Options = require('../../assets/js/components/Options.jsx');
    TestUtils = React.addons.TestUtils;
    // Create the React component here using TestUtils and store into Component
  });

  it('should work', function () {
    expect(2 + 2).toEqual(4);
  });
});
