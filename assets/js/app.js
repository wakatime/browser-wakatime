/* This is a fix for Bootstrap requiring jQuery */
global.jQuery = require('jquery');
require('bootstrap');

var React = require('react');
var WakaTime = require('./components/WakaTime.react');

React.render(
    <WakaTime />,
    document.getElementById('wakatime')
);
