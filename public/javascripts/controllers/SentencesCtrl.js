onceUpon.controller('SentencesCtrl', function SentencesCtrl(
  $scope, SentencesFactory, SocketFactory) {
    // Mirror the array of posts returned by the factory
    $scope.sentences = SentencesFactory.sentences;


});
