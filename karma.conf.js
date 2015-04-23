module.exports = function(config){
  config.set({

    basePath : './',

    preprocessors: {
      'app/components/**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
       // setting this option will create only a single module that contains templates
       // from all the files, so you can load them all with module('foo')
      moduleName: 'templates',
      //prependPrefix: 'app/'
      stripPrefix: 'app/'
     },

    files : [
      'app/bower_components/jquery/dist/jquery.min.js',
      'app/bower_components/jquery-ui/jquery-ui.min.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-ui-sortable/sortable.js',

      'app/components/**/*.js',
      'app/components/**/*.html'

    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter',
      'karma-ng-html2js-preprocessor'
    ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
