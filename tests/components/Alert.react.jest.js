jest.dontMock('../../assets/js/components/Alert.react.js');

describe('Wakatime', function() {
    var React, Alert, TestUtils, Component;

    beforeEach(function() {
        // Setup our tools
        React = require('react/addons');
        Alert = require('../../assets/js/components/Alert.react.js');
        TestUtils = React.addons.TestUtils;
        // Create the React component here using TestUtils and store into Component
    });

    it('should work', function() {
        expect(2 + 2).toEqual(4);
    });
});