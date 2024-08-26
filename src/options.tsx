import React from 'react';
import { createRoot } from 'react-dom/client';
import Options from './components/Options';

/* This is a fix for Bootstrap requiring jQuery */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
global.jQuery = require('jquery');
require('bootstrap');

const container = document.getElementById('wakatime-options');
if (container) {
  const root = createRoot(container);
  root.render(<Options />);
}
