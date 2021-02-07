/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as fs from 'fs';
import { join } from 'path';
import * as shelljs from 'shelljs';
const { load, exec, serial, concurrent } = require('@xarc/run');

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
  build: [serial('postinstall', exec('gulp')), 'webpack'],
  clean: [exec('rimraf public coverage vendor'), 'clean:webpack'],
  'clean:webpack': exec('rimraf dist'),
  eslint: exec('eslint src . --fix'),
  less: exec('lessc assets/less/app.less public/css/app.css'),
  lint: ['prettier', 'eslint'],
  postinstall: ['clean', makePublicFolder, copyFromNodeModules, 'less'],
  prettier: [exec('prettier --write .')],
  'remotedev-server': exec('remotedev --hostname=localhost --port=8000'),
  test: ['build', 'lint', 'test-jest', 'test-js'],
  'test-jest': [exec('jest --clearCache'), exec('jest --verbose --coverage')],
  'test-jest-update': exec('jest -u'),
  'test-js': 'phantomjs tests/run.js',
  watch: concurrent('watch-jest', 'webpack:watch', 'remotedev-server'),
  'watch-jest': exec('jest --watch'),
  'web-ext:run:chrome': concurrent('web-ext:run:chrome-next', 'web-ext:run:chrome-legacy'),
  'web-ext:run:chrome-legacy': exec('web-ext run -t chromium --source-dir .'),
  'web-ext:run:chrome-next': exec('web-ext run -t chromium --source-dir dist/chrome'),
  'web-ext:run:firefox': concurrent('web-ext:run:firefox-next', 'web-ext:run:firefox-legacy'),
  'web-ext:run:firefox-legacy': exec('web-ext run -t firefox-desktop --source-dir .'),
  'web-ext:run:firefox-next': exec('web-ext run -t firefox-desktop --source-dir dist/firefox'),
  webpack: ['clean:webpack', exec('webpack --mode production')],
  'webpack:dev': ['clean:webpack', exec('webpack --mode development')],
  'webpack:watch': ['clean:webpack', exec('webpack --mode development --watch')],
});
