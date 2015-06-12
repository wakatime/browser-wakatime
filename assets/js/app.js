/* This is a fix for Bootstrap requiring jQuery */
global.jQuery = require('jquery');
require('bootstrap');

import React from 'react';
import WakaTime from './components/WakaTime.react.js';

React.render(
    <WakaTime />,
    document.getElementById('wakatime')
);