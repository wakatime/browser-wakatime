/* This is a fix for Bootstrap requiring jQuery */
global.jQuery = require('jquery');
require('bootstrap');

var React = require('react');

// React components
var Options = require('./components/Options.react');

React.render(
    <Options />,
    document.getElementById('wakatime-options')
);