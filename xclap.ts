const { load, exec, concurrent, serial } = require('@xarc/run');

load({
  build: ['postinstall', exec('gulp'), 'prettier'],
  clean: exec('rimraf public coverage vendor'),
  prettier: [exec('prettier --write .')],
  lint: ['prettier'],
  postinstall: ['clean', exec('gulp postinstall')],
  test: ['build', 'lint', 'test-jest', 'test-js'],
  'test-jest': [exec('jest --clearCache'), exec('jest --verbose --coverage')],
  'test-js': 'phantomjs tests/run.js',
});
