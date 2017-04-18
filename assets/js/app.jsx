
/* This is a fix for Bootstrap requiring jQuery */
global.jQuery = require('jquery');
require('bootstrap');

var React = require('react');
var ReactDOM = require('react-dom');

// React components
var WakaTime = require('./components/WakaTime.jsx');

ReactDOM.render(
    <WakaTime />,
    document.getElementById('wakatime')
);
