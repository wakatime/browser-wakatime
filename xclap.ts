const { load, exec, concurrent, serial } = require("@xarc/run");

load({
  build: ["postinstall", exec("gulp")],
  clean: exec("rimraf public coverage vendor"),
  prettier: exec("prettier --write ."),
  lint: ["prettier"],
  postinstall: ["clean", exec("bower install"), exec("gulp postinstall")],
  test: ["build", "lint", "test-jest", "test-mocha", "test-react"],
  "test-jest": [exec("jest --clearCache"), exec("jest --verbose --coverage")],
  "test-mocha": "mocha --compilers js:mocha-traceur tests/**/*.spec.js",
  "test-react": "jest --verbose --coverage",
  "test-js": "node_modules/.bin/phantomjs tests/run.js",
});
