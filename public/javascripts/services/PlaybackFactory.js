onceUpon.factory('PlaybackFactory', function PlaybackFactory($rootScope, SentencesFactory) {
  var factory = {};

  factory.sentenceIds;
  factory.playing = null;

  // Watch sentences for changes if another user updated
  $rootScope.$watch(function() {
    return SentencesFactory.sentences;
  }, function(newValue, oldValue) {
    factory.sentenceIds = newValue.map(function(sentence) {
      return sentence._id;
    });
  });

  factory.playAudio = function(sentenceId) {
    // Make sure this audio is loaded first
    factory.loadAudio(sentenceId);

    // If something else is playing, stop it and start playing this one
    factory.stopAll();

    // Play this audio, change class of its parent, and track its state
    var thisAudio = $('audio#' + sentenceId);
    thisAudio[0].play();
    thisAudio.parent().addClass('playing');
    factory.playing = sentenceId;

    // Before we play the next track, lazy load it
    var nextId = factory.sentenceIds[factory.sentenceIds.indexOf(sentenceId)+1];
    if (nextId) {
      factory.loadAudio(nextId);
    }

    // When this audio finishes, play the next one if available
    thisAudio[0].addEventListener('ended', function() {
      thisAudio.parent().removeClass('playing');
      if (nextId) {
        factory.playAudio(nextId);
        if (!factory.sentenceIsVisible(nextId)) {
          var nextSentenceElement = $('li.sentence').get(factory.sentenceIds.indexOf(nextId));
          $('#sentences-panel').animate({scrollTop:nextSentenceElement.offsetTop - 15}, 300);
        };
      }
      $rootScope.$apply(); // apply scope in custom event listeners
    });

  }

  factory.playFromBeginning = function() {
    factory.playAudio(factory.sentenceIds[0]);
    $('#sentences-panel').animate({scrollTop:0}, 500);
  }

  factory.stopAll = function() {
    if (factory.playing) {
      var playingAudio = $('audio#' + factory.playing);
      playingAudio[0].pause();
      playingAudio[0].currentTime = 0; // reset this clip back to beginning
      playingAudio.parent().removeClass('playing');
      factory.playing = null;
    }
  }

  factory.loadAudio = function(sentenceId) {
    var thisAudio = $('audio#' + sentenceId);
    if (!thisAudio.attr('src')) {
      thisAudio.attr('src', 'getRecording/' + sentenceId);
    }
  }

  // Figure out if sentence is currently being displayed in sentence panel
  // for the purposes of automatically scrolling while playing
  factory.sentenceIsVisible = function(sentenceId) {
    var thisIndex = factory.sentenceIds.indexOf(sentenceId);
    var thisSentence = $('li.sentence').get(thisIndex);
    var top = $(thisSentence).position().top + $(thisSentence).height();
    return (top > 0) && (top < $('#sentences-panel').innerHeight());
  }

  return factory;
});
