/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
const { load, exec, serial } = require('@xarc/run');

load({
  build: [serial('postinstall', exec('gulp'), 'webpack', 'prettier'), 'webpack'],
  clean: exec('rimraf public coverage vendor'),
  'clean:webpack': exec('rimraf dist'),
  eslint: exec('eslint src . --fix'),
  lint: ['prettier', 'eslint'],
  postinstall: ['clean', exec('gulp postinstall')],
  prettier: [exec('prettier --write .')],
  test: ['build', 'lint', 'test-jest', 'test-js'],
  'test-jest': [exec('jest --clearCache'), exec('jest --verbose --coverage')],
  'test-js': 'phantomjs tests/run.js',
  webpack: ['clean:webpack', exec('webpack --mode production')],
  'webpack:dev': ['clean:webpack', exec('webpack --mode development')],
});
