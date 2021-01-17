import React from 'react';
import ReactDOM from 'react-dom';
const container = document.getElementById('wakatime');

const openOptions = async (): Promise<void> => {
  await browser.runtime.openOptionsPage();
};
ReactDOM.render(
  <>
    <h1>POPUP GO HERE</h1>
    <div onClick={openOptions}>Open options</div>
  </>,
  container,
);
