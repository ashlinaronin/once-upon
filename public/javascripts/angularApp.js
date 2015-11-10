var onceUpon = angular.module('onceUpon', ['ui.router']);

onceUpon.config(function($stateProvider, $urlRouterProvider) {

  // Url must be a blank string for the default / state
  $stateProvider.state('home', {
    url: "",
    templateUrl: 'partials/main.html',
    controller: 'SentencesCtrl'
  });
});
