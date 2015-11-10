var onceUpon = angular.module('onceUpon', ['ui.router']);

onceUpon.config(function($stateProvider, $urlRouterProvider) {
  /* By using the resolve property here, we make sure that anytime our home state
  ** is entered, we automatically query all posts from our backend before the
  ** state actually finishes loading. */
  $stateProvider.state('home', {
    url: "",
    templateUrl: 'partials/main.html',
    controller: 'SentencesCtrl',
    resolve: {
      sentencePromise: ['SentencesFactory', function(SentencesFactory) {
        return SentencesFactory.getAll();
      }]
    }
  });

  // not sure we really need the resolve here because
  // we may not be displaying data at this state
  // but we'll try it for now
  $stateProvider.state('record', {
    url: "/record",
    templateUrl: 'partials/record.html',
    controller: 'RecordCtrl',
    resolve: {
      sentencePromise: ['SentencesFactory', function(SentencesFactory) {
        return SentencesFactory.getAll();
      }]
    }
  });
});
