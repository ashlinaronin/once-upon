// TODO: need a factory to keep track of what is playing so we can stop it
onceUpon.directive('onceAudio', function(SentencesFactory) {
  /* This directive is restricted to matching by attribute name
  ** because of the use case: <audio once-get-audio>.
  ** From the Angular docs: 'Use an attribute when you are
  ** decorating an existing element with new functionality.'
  ** We're using an isolate scope bound to the attribute
  ** once-get-audio.
  */
  function link(scope, element, attrs) {
    attrs.$observe('onceAudio', function(sentenceId) {
      // Use plain ol' src here, not ng-src, because we are
      // basically doing what ng-src does, and the audio
      // won't actually load with ng-src here.  Maybe because
      // of the order that the DOM is processed.
      element.attr('src', '/getRecording/' + sentenceId);

      scope.sentences = SentencesFactory.sentences;

      // Reset bindings whenever we get new sentences
      scope.$watch(function() {
        return SentencesFactory.sentences;
      },
      function(newVal, oldVal) {
        scope.sentences = newVal;
        var thisIndex = SentencesFactory.sentences.indexOf(scope.sentence);
        var numSentences = SentencesFactory.sentences.length;

        if (thisIndex < (numSentences-1)) { // there is a next sentence
          element.bind('ended', function() {
            var nextSentence = element.context.parentElement.nextElementSibling;
            element.parent().removeClass('playing');
            angular.element(nextSentence).addClass('playing');
            nextSentence.lastElementChild.play();
            SentencesFactory.currentlyPlaying = nextSentence;
          });
        } else { // no next sentence
          element.bind('ended', function() {
            SentencesFactory.currentlyPlaying = null;
            element.parent().removeClass('playing');
          });
        }
      });
    });
  }

  // Return the directive we've created, including the link function
  // which actually updates the DOM.
  // In this case, we need to use @, which binds a local/directive
  // scope property to the evaluated value of the DOM attribute.
  // Because we're printing the ID to the attribute value with Angular,
  // we need to make sure it evaluates first and we don't need double-
  // binding with the directive/controller scope.
  return {
    restrict: 'A',
    scope: {
      onceAudio: '@',
      sentence: '='
    },
    link: link
  };

});


/*
** Directive to play the whole story starting from a given sentence.
*/
onceUpon.directive('oncePlayFrom', function(SentencesFactory) {
  function link(scope, element, attrs) {
    element.bind('click', function() {
      element.find('audio')[0].play();
      element.addClass('playing');
      SentencesFactory.currentlyPlaying = element[0];
      console.dir(SentencesFactory.currentlyPlaying);
    });
  };

  return {
    restrict: 'A',
    scope: {
      onceGetAudio: '@'
    },
    link: link
  }
});



onceUpon.directive('navbarExpand', function() {
  function link (scope, element, attrs) {
    element.bind('click', function() {
      var currentWidth = element.width();
      console.log('current width: ' + currentWidth);

      if (currentWidth === 40) {
        console.log('i am small, i should get big now');
      } else if (currentWidth === 400) {
        console.log('i am big, i should get small now');
      }

      element.css('width', '400px');

      var contentDiv = element.find('#navbar-content');
      contentDiv.show();
      console.dir(contentDiv);
    });
  };

  return {
    restrict: 'A',
    scope: {},
    link: link
  };
});
