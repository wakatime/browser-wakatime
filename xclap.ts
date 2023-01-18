/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as fs from 'fs';
import { join } from 'path';
import * as shelljs from 'shelljs';
import waitOn from 'wait-on';
const { load, exec, serial, concurrent } = require('@xarc/run');

const waitForFilesTask =
  (...files: string[]) =>
  (): Promise<unknown> => {
    return waitOn({
      delay: 2000,
      interval: 3000,
      resources: [...files],
      verbose: true,
    });
  };
const nextBuildFolder = join(__dirname, 'dist');
const ffNextBuildFolder = join(nextBuildFolder, 'firefox');
const chromeNextBuildFolder = join(nextBuildFolder, 'chrome');
const filesNeededForNextBuild = [
  'manifest.json',
  'background.js',
  'options.js',
  'options.html',
  'popup.js',
  'popup.html',
  'public/js/browser-polyfill.min.js',
  'public/css/app.css',
  'graphics/wakatime-logo-16.png',
];
const chromeNextBuildFileWaitTask = waitForFilesTask(
  nextBuildFolder,
  chromeNextBuildFolder,
  ...filesNeededForNextBuild.map((f) => join(chromeNextBuildFolder, f)),
);
const ffNextBuildFileWaitTask = waitForFilesTask(
  nextBuildFolder,
  ffNextBuildFolder,
  ...filesNeededForNextBuild.map((f) => join(ffNextBuildFolder, f)),
);
const makePublicFolder = () => {
  if (!fs.existsSync('public/js')) {
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public');
    }
    fs.mkdirSync('public/js');
  }
};
const copyFromNodeModules = () => {
  fs.copyFileSync(
    'node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
    'public/js/browser-polyfill.min.js',
  );
  fs.copyFileSync(
    'node_modules/webextension-polyfill/dist/browser-polyfill.min.js.map',
    'public/js/browser-polyfill.min.js.map',
  );
  shelljs.cp(
    '-Rf',
    join(__dirname, 'node_modules/font-awesome/fonts'),
    join(__dirname, 'public/fonts/'),
  );
};
load({
  build: [
    serial('postinstall'),
    'webpack',
    concurrent(
      exec('web-ext build'),
      exec(`web-ext build -a dist/firefox/web-ext-artifacts --source-dir ${ffNextBuildFolder}`),
    ),
  ],
  clean: [exec('rimraf public coverage vendor web-ext-artifacts'), 'clean:webpack'],
  'clean:webpack': exec('rimraf dist'),
  dev: [
    'clean',
    'postinstall',
    concurrent('watch', 'web-ext:run:firefox-next', 'web-ext:run:chrome-next'),
  ],
  'dev:legacy': [
    'clean',
    'postinstall',
    concurrent(exec('gulp watch'), 'web-ext:run:firefox-legacy', 'web-ext:run:chrome-legacy'),
  ],
  eslint: exec('eslint src . --fix'),
  lint: ['prettier', 'eslint'],
  postinstall: ['clean', makePublicFolder, copyFromNodeModules, 'sass'],
  prettier: [exec('prettier --write .')],
  'remotedev-server': exec('remotedev --hostname=localhost --port=8000'),
  sass: exec('node-sass assets/sass/app.scss public/css/app.css'),
  test: ['build', 'lint', 'test-jest'],
  'test-jest': [exec('jest --clearCache'), exec('jest --verbose --coverage')],
  'test-jest-update': exec('jest -u'),
  'wait:legacy-files': waitForFilesTask(
    'manifest.json',
    'public/js/browser-polyfill.min.js',
    'public/js/events.js',
    'options.html',
  ),
  watch: concurrent('watch-jest', 'webpack:watch'),
  'watch-jest': exec('jest --watch'),
  'web-ext:run:chrome': concurrent('web-ext:run:chrome-next', 'web-ext:run:chrome-legacy'),
  'web-ext:run:chrome-legacy': [
    'wait:legacy-files',
    exec('web-ext run -t chromium --source-dir .'),
  ],
  'web-ext:run:chrome-next': [
    chromeNextBuildFileWaitTask,
    exec('web-ext run -t chromium --source-dir dist/chrome'),
  ],
  'web-ext:run:firefox': concurrent('web-ext:run:firefox-next', 'web-ext:run:firefox-legacy'),
  'web-ext:run:firefox-legacy': [
    'wait:legacy-files',
    exec('web-ext run -t firefox-desktop --source-dir .'),
  ],
  'web-ext:run:firefox-next': [
    ffNextBuildFileWaitTask,
    exec('web-ext run -t firefox-desktop --source-dir dist/firefox'),
  ],
  webpack: ['clean:webpack', exec('webpack --mode production')],
  'webpack:dev': ['clean:webpack', exec('webpack --mode development')],
  'webpack:watch': ['clean:webpack', exec('webpack --mode development --watch')],
});
