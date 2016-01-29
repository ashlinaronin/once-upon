onceUpon.factory('PlaybackFactory', function PlaybackFactory($rootScope, SentencesFactory) {
  var factory = {};

  factory.sentenceIds;
  factory.playing = null;
  factory.audio = $('audio#playback');

  // Watch sentences for changes if another user updated
  // Boil down the sentences array into just sentence ids for our purposes here
  $rootScope.$watch(function() {
    return SentencesFactory.sentences;
  }, function(newValue, oldValue) {
    factory.sentenceIds = newValue.map(function(sentence) {
      return sentence._id;
    });
  });


  factory.init = function() {
    // When the playing audio finishes, play the next audio if available
    factory.audio[0].addEventListener('ended', function() {
      $('li.sentence#' + factory.playing).removeClass('playing');

      var nextId = factory.sentenceIds[factory.sentenceIds.indexOf(factory.playing)+1];
      if (nextId) {
        factory.playAudio(nextId);
        // If next sentence is not visible, scroll to it automatically
        if (!factory.sentenceIsVisible(nextId)) {
          var nextSentenceElement = $('li.sentence#' + nextId);
          $('#sentences-panel').animate({scrollTop:nextSentenceElement[0].offsetTop - 15}, 300);
        };
      } else {
        // No next audio, so update playing var to indicate that
        factory.playing = null;
      }
      $rootScope.$apply(); // apply scope in custom event listeners
    });
  }

  factory.playAudio = function(sentenceId) {
    // Stop the currently playing clip
    factory.stopAll();

    // Load and play the new clip
    factory.audio[0].src = "getRecording/" + sentenceId;
    factory.audio[0].load();
    factory.audio[0].play();

    // Keep track of what's playing visually and programmatically
    $('li.sentence#' + sentenceId).addClass('playing');
    factory.playing = sentenceId;
  }

  factory.playFromBeginning = function() {
    factory.playAudio(factory.sentenceIds[0]);
    $('#sentences-panel').animate({scrollTop:0}, 500);
  }

  factory.stopAll = function() {
    if (factory.playing) {
      factory.audio[0].pause();
      factory.audio[0].currentTime = 0; // reset this clip back to beginning
      $('li.sentence#' + factory.playing).removeClass('playing');
      factory.playing = null;
    }
  }

  // Figure out if sentence is currently being displayed in sentence panel
  // for the purposes of automatically scrolling while playing
  factory.sentenceIsVisible = function(sentenceId) {
    var thisSentence = $('li.sentence#' + sentenceId);
    var top = $(thisSentence).position().top + $(thisSentence).height();
    return (top > 0) && (top < $('#sentences-panel').innerHeight());
  }

  // gotta actually run the init
  factory.init();

  return factory;
});
