onceUpon.controller('SentencesCtrl', function SentencesCtrl(
  $scope, SentencesFactory, PlaybackFactory, SocketFactory) {

    $scope.SentencesFactory = SentencesFactory;
    $scope.PlaybackFactory = PlaybackFactory;
    $scope.SocketFactory = SocketFactory;
});
