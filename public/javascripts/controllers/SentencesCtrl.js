onceUpon.controller('SentencesCtrl', function SentencesCtrl(
  $scope, SentencesFactory, SocketFactory, PlaybackFactory) {
    // Mirror the array of posts returned by the factory
    $scope.sentences = SentencesFactory.sentences;
    $scope.currentMessage = SocketFactory.currentMessage;
    $scope.userPosition = SocketFactory.userPosition;

    $scope.sentenceIds;

    // this variable will contain the id of the currently playing audio clip
    // accessing / playing and stopping particular thing by id in the factory method
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


    // Watch sentences for changes if another user updated
    $scope.$watch(function() {
      return SentencesFactory.sentences;
    }, function(newValue, oldValue) {
      $scope.sentences = newValue;
      $scope.sentenceIds = $scope.sentences.map(function(sentence) {
        return sentence._id;
      });
    });



    // playback stuff can go here, this controller isn't doing anything else right?
    // lets try this and see if it works, if not can put in directive
    // one other way to do it would be instead of using sentenceid, to play audio
    // by order in queue.... dunno which is better. this seems to work for now.

    // very similar to old directive version but not relying on dom bindings,
    // instead tracking state more specifically and going from there

    $scope.playAudio = function(sentenceId) {
      // Make sure this audio is loaded first
      $scope.loadAudio(sentenceId);

      // If something else is playing, stop it and start playing this one
      $scope.stopAll();

      // Play this audio, change class of its parent, and track its state
      var thisAudio = $('audio#' + sentenceId);
      thisAudio[0].play();
      thisAudio.parent().addClass('playing');
      // $scope.playing = sentenceId;
      PlaybackFactory.playing = sentenceId;

      // Before we play the next track, lazy load it
      var nextId = $scope.sentenceIds[$scope.sentenceIds.indexOf(sentenceId)+1];
      if (nextId) {
        $scope.loadAudio(nextId);
      }

      // When this audio finishes, play the next one if available
      thisAudio[0].addEventListener('ended', function() {
        thisAudio.parent().removeClass('playing');
        if (nextId) {
          $scope.playAudio(nextId);
          if (!$scope.sentenceIsVisible(nextId)) {
            var nextSentenceElement = $('li.sentence').get($scope.sentenceIds.indexOf(nextId));
            $('#sentences-panel').animate({scrollTop:nextSentenceElement.offsetTop - 15}, 300);
          };
        }
        $scope.$apply(); // apply scope in custom event listeners
      });

    }

    $scope.playFromBeginning = function() {
      $scope.playAudio($scope.sentenceIds[0]);
      $('#sentences-panel').animate({scrollTop:0}, 500);
    }

    $scope.stopAll = function() {
      if (PlaybackFactory.playing) {
        var playingAudio = $('audio#' + PlaybackFactory.playing);
        playingAudio[0].pause();
        playingAudio[0].currentTime = 0; // reset this clip back to beginning
        playingAudio.parent().removeClass('playing');
        // $scope.playing = null;
        PlaybackFactory.playing = null;
      }
    }

    $scope.loadAudio = function(sentenceId) {
      var thisAudio = $('audio#' + sentenceId);
      if (!thisAudio.attr('src')) {
        thisAudio.attr('src', 'getRecording/' + sentenceId);
      }
    }

    // Figure out if sentence is currently being displayed in sentence panel
    // for the purposes of automatically scrolling while playing
    $scope.sentenceIsVisible = function(sentenceId) {
      var thisIndex = $scope.sentenceIds.indexOf(sentenceId);
      var thisSentence = $('li.sentence').get(thisIndex);
      var top = $(thisSentence).position().top + $(thisSentence).height();
      return (top > 0) && (top < $('#sentences-panel').innerHeight());
    }

});
