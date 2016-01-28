onceUpon.controller('SentencesCtrl', function SentencesCtrl(
  $scope, SentencesFactory, SocketFactory, PlaybackFactory) {
    // Mirror the array of posts returned by the factory
    $scope.sentences = SentencesFactory.sentences;
    $scope.currentMessage = SocketFactory.currentMessage;
    $scope.userPosition = SocketFactory.userPosition;

    $scope.sentenceIds;
    $scope.PlaybackFactory = PlaybackFactory;

    $scope.$watch(function() {
      return SocketFactory.currentMessage;
    }, function(newVal, oldVal) {
      $scope.currentMessage = newVal;
    });

    $scope.$watch(function() {
      return SocketFactory.userPosition;
    }, function(newVal, oldVal) {
      $scope.userPosition = newVal;
    });
});
