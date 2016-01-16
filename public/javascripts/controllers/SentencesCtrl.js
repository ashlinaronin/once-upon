onceUpon.controller('SentencesCtrl', function SentencesCtrl(
  $scope, SentencesFactory, SocketFactory) {
    // Mirror the array of posts returned by the factory
    $scope.sentences = SentencesFactory.sentences;
    $scope.currentMessage = SocketFactory.currentMessage;
    $scope.userPosition = SocketFactory.userPosition;

    // this variable will contain the id of the currently playing audio clip
    // accessing / playing and stopping particular thing by id in the factory method
    $scope.playing = null;

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



    // playback stuff can go here, this controller isn't doing anything else right?
    // lets try this and see if it works, if not can put in directive

    $scope.playFrom = function(sentenceId) {
      // if something else is playing, stop it and start playing this one
      $scope.stopAll();
      $scope.playing = sentenceId;
      var thisAudio = $('audio#' + sentenceId)[0];
      thisAudio.play();
      console.log('finished? ' + thisAudio.ended);

    }

    $scope.stopAll = function() {
      if ($scope.playing) {
        var playingAudio = $('audio#' + $scope.playing)[0];
        playingAudio.pause();
        playingAudio.currentTime = 0; // reset this clip back to beginning
        $scope.playing = null;
      }
    }

});
