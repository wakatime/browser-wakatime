jest.dontMock('../../assets/js/components/SitesList.jsx');

describe('SitesList', function () {
  var React, SitesList, TestUtils, Component;

  beforeEach(function () {
    // Setup our tools
    React = require('react/addons');
    SitesList = require('../../assets/js/components/SitesList.jsx');
    TestUtils = React.addons.TestUtils;
    // Create the React component here using TestUtils and store into Component
  });

  it('should work', function () {
    expect(2 + 2).toEqual(4);
  });
});
