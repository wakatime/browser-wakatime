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

elixir.config.assetsPath = 'assets/';

elixir(function (mix) {
  mix.browserify('app.jsx', 'public/js/app.js', 'assets/js');
  mix.browserify('events.js', 'public/js/events.js', 'assets/js');
  mix.browserify('options.jsx', 'public/js/options.js', 'assets/js');
  mix.browserify('devtools.js', 'public/js/devtools.js', 'assets/js');
});
