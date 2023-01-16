import React from 'react';
import { createRoot } from 'react-dom/client';
import Options from './components/Options';

/* This is a fix for Bootstrap requiring jQuery */
global.jQuery = require('jquery');
require('bootstrap');

const container = document.getElementById('wakatime-options');
const root = createRoot(container!);

root.render(<Options />);
