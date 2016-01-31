var onceUpon = angular.module('onceUpon', ['ui.router', 'ngAnimate']);

// set up Modernizr so we can access it from other parts of the app
onceUpon.constant('Modernizr', Modernizr);

onceUpon.config(function($stateProvider, $urlRouterProvider) {
  /* By using the resolve property here, we make sure that anytime our home state
  ** is entered, we automatically query all posts from our backend before the
  ** state actually finishes loading. */
  $stateProvider.state('home', {
    url: "",
    views: {
      'status': {
        templateUrl: 'partials/status.html',
        controller: 'StatusCtrl'
      },
      'sentences': {
        templateUrl: 'partials/sentences.html',
        controller: 'SentencesCtrl'
      },
      'record': {
        templateUrl: 'partials/record.html',
        controller: 'RecordCtrl'
      }
    },
    resolve: {
      sentencePromise: ['SentencesFactory', function(SentencesFactory) {
        return SentencesFactory.getAll();
      }]
    }
  });
});
