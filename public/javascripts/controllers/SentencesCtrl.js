onceUpon.controller('SentencesCtrl', function SentencesCtrl(
  $scope, SentencesFactory, PlaybackFactory, SocketFactory) {

    $scope.SentencesFactory = SentencesFactory;
    $scope.PlaybackFactory = PlaybackFactory;
    $scope.SocketFactory = SocketFactory;

    $scope.getCursorClass = function() {
      if (SocketFactory.userPosition === 0) {
        return "blinking-cursor-you";
      } else {
        return "blinking-cursor-friend";
      }
    }
});
