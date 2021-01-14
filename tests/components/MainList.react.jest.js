jest.dontMock('../../assets/js/components/MainList.jsx');

describe('MainList', function () {
  var React, MainList, TestUtils, Component;

  beforeEach(function () {
    // Setup our tools
    React = require('react/addons');
    MainList = require('../../assets/js/components/MainList.jsx');
    TestUtils = React.addons.TestUtils;
    // Create the React component here using TestUtils and store into Component
  });

  it('should work', function () {
    expect(2 + 2).toEqual(4);
  });
});
