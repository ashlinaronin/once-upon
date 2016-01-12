onceUpon.controller('SentencesCtrl', function SentencesCtrl(
  $scope, SentencesFactory, SocketFactory) {
    // Mirror the array of posts returned by the factory
    $scope.sentences = SentencesFactory.sentences;
    $scope.currentMessage = SocketFactory.currentMessage;
    $scope.userPosition = SocketFactory.userPosition;

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


    // Watch sentences for changes if another user updated
    $scope.$watch(function() {
      return SentencesFactory.sentences;
    }, function(newValue, oldValue) {
      $scope.sentences = newValue;
    });

});
