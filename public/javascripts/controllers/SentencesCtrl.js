onceUpon.controller('SentencesCtrl', function SentencesCtrl(
  $scope, SentencesFactory, PlaybackFactory) {

    $scope.SentencesFactory = SentencesFactory;
    $scope.PlaybackFactory = PlaybackFactory;
});
