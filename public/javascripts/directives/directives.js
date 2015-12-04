// TODO: need a factory to keep track of what is playing so we can stop it
onceUpon.directive('onceAudio', function() {
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

      // Very strange behavior with jQuery... just selects itself over and over
      // var nextAudio = element.parent().next().find('audio');

      // If we have a next sentence, set up a binding to play it next
      // Using convoluted jqLite selectors here because jQuery wasn't working
      var nextSentence = element.context.parentElement.nextElementSibling;
      if (nextSentence) {
        element.bind('ended', function() {
          element.parent().removeClass('playing');
          angular.element(nextSentence).addClass('playing');
          nextSentence.lastElementChild.play();
        });
      }

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
      onceAudio: '@'
    },
    link: link
  };

});


/*
** Directive to play the whole story starting from a given sentence.
*/
onceUpon.directive('oncePlayFrom', function() {
  function link(scope, element, attrs) {
    element.bind('click', function() {
      element.find('audio')[0].play();
      element.addClass('playing');
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
