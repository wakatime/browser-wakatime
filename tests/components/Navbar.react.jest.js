jest.dontMock('../../assets/js/components/Navbar.jsx');

describe('Navbar', function () {
  var React, Navbar, TestUtils, Component;

  beforeEach(function () {
    // Setup our tools
    React = require('react/addons');
    Navbar = require('../../assets/js/components/Navbar.jsx');
    TestUtils = React.addons.TestUtils;
    // Create the React component here using TestUtils and store into Component
  });

  it('should work', function () {
    expect(2 + 2).toEqual(4);
  });
});
