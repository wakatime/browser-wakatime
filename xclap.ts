const { load, exec, concurrent, serial } = require('@xarc/run');

load({
  build: ['postinstall', exec('gulp'), 'prettier'],
  clean: exec('rimraf public coverage vendor'),
  // Temp run prettier twice to format some of bootstrap less files
  prettier: [exec('prettier --write .'), exec('prettier --write .')],
  lint: ['prettier'],
  postinstall: ['clean', exec('gulp postinstall')],
  test: ['build', 'lint', 'test-jest', 'test-js'],
  'test-jest': [exec('jest --clearCache'), exec('jest --verbose --coverage')],
  'test-js': 'phantomjs tests/run.js',
});
