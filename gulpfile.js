var del = require('del');
var gulp = require('gulp');
var elixir = require('laravel-elixir');
var exec = require('child_process').exec;
var fs = require('fs');

/*
 |--------------------------------------------------------------------------
 | Pre-defined Gulp Tasks
 |--------------------------------------------------------------------------
 |
 | Tasks outside the scope of Elixir can be predefined before setting it up.
 |
 */

gulp.task('postinstall', function (cb) {
    // .pem files cause Chrome to show a bunch of warnings
    //so we remove them on postinstall
    del('node_modules/**/*.pem', cb);
});
gulp.task('webextension',function(cb){
    exec('npm install',{
        cwd: 'node_modules/webextension-polyfill/'
    },function(){
        var stream = fs.createWriteStream('public/js/browser-polyfill.min.js');
        stream.on('done',cb);
        fs.createReadStream('node_modules/webextension-polyfill/dist/browser-polyfill.min.js').pipe(stream);
    });
});

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

elixir.extend('webextension', function(){
    return gulp.start('webextension');
});

elixir(function (mix) {
    mix.webextension();
    mix.copy('vendor/bower_components/bootstrap/less', 'assets/less/bootstrap');
    /*mix.copy('vendor/bower_components/bootstrap/fonts', 'public/fonts');
    mix.copy('vendor/bower_components/font-awesome/less', 'assets/less/font-awesome');
    mix.copy('vendor/bower_components/font-awesome/fonts', 'public/fonts');
    mix.less('app.less');
    mix.browserify('app.jsx', 'public/js/app.js', 'assets/js');
    mix.browserify('events.js', 'public/js/events.js', 'assets/js');
    mix.browserify('options.jsx', 'public/js/options.js', 'assets/js');
    mix.browserify('devtools.js', 'public/js/devtools.js', 'assets/js');*/
});
