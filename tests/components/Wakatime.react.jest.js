jest.dontMock('../../assets/js/components/Wakatime.jsx');

describe('Wakatime', function () {
  var React, Wakatime, TestUtils, Component;

  beforeEach(function () {
    // Setup our tools
    React = require('react/addons');
    Wakatime = require('../../assets/js/components/Wakatime.jsx');
    TestUtils = React.addons.TestUtils;
    // Create the React component here using TestUtils and store into Component
  });

  it('should work', function () {
    expect(2 + 2).toEqual(4);
  });
});
