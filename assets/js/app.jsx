/** @jsx React.DOM */

/* This is a fix for Bootstrap requiring jQuery */
global.jQuery = require('jquery');
require('bootstrap');

var React = require('react');

// React components
var WakaTime = require('./components/WakaTime.jsx');

React.render(
    <WakaTime />,
    document.getElementById('wakatime')
);