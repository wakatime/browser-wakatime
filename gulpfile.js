var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Less
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir.config.assetsDir = 'assets/';

elixir(function (mix) {
    mix.copy('vendor/bower_components/bootstrap/less', 'assets/less/bootstrap');
    mix.copy('vendor/bower_components/bootstrap/fonts', 'public/fonts');
    mix.copy('vendor/bower_components/font-awesome/less', 'assets/less/font-awesome');
    mix.copy('vendor/bower_components/font-awesome/fonts', 'public/fonts');
    mix.less('app.less');
    //mix.browserify('app.js', null, 'assets/js');
    mix.browserify('events.js', 'public/js/events.js', 'assets/js');
    //mix.browserify('options.js', 'public/js/options.js', 'assets/js');
});
