/**
 * Test Runner for Mocha tests
 * Using phantomjs to render page and execute scripts
 */

var node_modules = '../node_modules/';
phantom.injectJs(node_modules + 'mocha/mocha.js');
phantom.injectJs(node_modules + 'sinon-chrome/src/phantom-tweaks.js');
mocha.setup({ ui: 'bdd', reporter: 'spec' });

// Setup
phantom.injectJs('beforeeach.js');

// Tests
phantom.injectJs('..' + '/helpers/changeExtensionTooltip.spec.js');

// Execute
mocha.run(function (failures) {
  // setTimeout is needed to supress "Unsafe JavaScript attempt to access..."
  // see https://github.com/ariya/phantomjs/issues/12697
  setTimeout(function () {
    phantom.exit(failures);
  }, 0);
});
