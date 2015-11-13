var onceUpon = angular.module('onceUpon', ['ui.router', 'ngSanitize']);

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


  // Stoped resolving all sentences here because it was slowing everything down
  $stateProvider.state('record', {
    url: "/record",
    templateUrl: 'partials/record.html',
    controller: 'RecordCtrl'
  });

  // Directive here for now
  // Won't work yet, need to modify
  var ngSrcClean = ['$sce', function($sce) {
    return function(scope, element, attr) {
      scope.$watch(attr.ngSrc, function ngSrcCleanWatchAction(value) {
        element.ngSrc($sce.getTrustedHtml(value) || '');
      });
    };
  }];

});
