/* global chrome */

/* This is a fix for Bootstrap requiring jQuery */
global.jQuery = require('jquery');
require('bootstrap');

var React = require('react');
var ReactDOM = require('react-dom');

// React components
var Options = require('./components/Options.jsx');

ReactDOM.render(
    <Options />,
    document.getElementById('wakatime-options')
);
