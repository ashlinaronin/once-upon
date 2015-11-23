onceUpon.controller('SentencesCtrl', function SentencesCtrl(
  $scope, SentencesFactory, SocketFactory) {
    // Mirror the array of posts returned by the factory
    $scope.sentences = SentencesFactory.sentences;

    // Watch sentences for changes if another user updated
    $scope.$watch(function() {
      return SentencesFactory.sentences;
    }, function(newValue, oldValue) {
      $scope.sentences = newValue;
    });


});
