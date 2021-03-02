/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
import { join } from 'path';
import waitOn from 'wait-on';
import remotedev from 'remotedev-server';

const { load, exec, concurrent } = require('@xarc/run');

const waitForFilesTask = (...files: string[]) => (): Promise<unknown> => {
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
  'browser-polyfill.min.js',
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

load({
  build: [
    'webpack',
    concurrent(
      exec('web-ext build'),
      exec(`web-ext build -a dist/firefox/web-ext-artifacts --source-dir ${ffNextBuildFolder}`),
    ),
  ],
  clean: [exec('rimraf public coverage vendor web-ext-artifacts'), 'clean:webpack'],
  'clean:webpack': exec('rimraf dist'),
  dev: ['clean', concurrent('watch', 'web-ext:run:firefox', 'web-ext:run:chrome')],
  'dev:chrome': ['clean', concurrent('watch', 'web-ext:run:chrome')],
  'dev:firefox': ['clean', concurrent('watch', 'web-ext:run:firefox')],
  eslint: exec('eslint src . --fix'),
  lint: ['prettier', 'eslint'],
  postinstall: ['clean', 'build'],
  prettier: [exec('prettier --write .')],
  'remotedev-server': () => {
    remotedev({
      hostname: 'localhost',
      port: 8000,
    });
  },
  test: ['build', 'lint', 'test-jest'],
  'test-jest': [exec('jest --clearCache'), exec('jest --verbose --coverage')],
  'test-jest-update': exec('jest -u'),
  watch: concurrent('watch-jest', 'webpack:watch'),
  'watch-jest': exec('jest --watch'),
  'web-ext:run:chrome': [
    chromeNextBuildFileWaitTask,
    exec('web-ext run -t chromium --source-dir dist/chrome'),
  ],
  'web-ext:run:firefox': [
    ffNextBuildFileWaitTask,
    exec('web-ext run -t firefox-desktop --source-dir dist/firefox'),
  ],
  webpack: ['clean:webpack', exec('webpack --mode production')],
  'webpack:dev': ['clean:webpack', exec('webpack --mode development')],
  'webpack:watch': ['clean:webpack', exec('webpack --mode development --watch')],
});
