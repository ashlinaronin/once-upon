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
      // won't actually load with ng-src here. This is probably because
      // of the order in which the DOM is rendered.
      element.attr('src', '/getRecording/' + sentenceId);

      // scope.sentences = SentencesFactory.sentences;
      //
      // // Reset bindings whenever we get new sentences
      // scope.$watch(function() {
      //   return SentencesFactory.sentences;
      // },
      // function(newVal, oldVal) {
      //   scope.sentences = newVal;
      //   var thisIndex = SentencesFactory.sentences.indexOf(scope.sentence);
      //   var numSentences = SentencesFactory.sentences.length;
      //
      //   if (thisIndex < (numSentences-1)) { // there is a next sentence
      //     element.bind('ended', function() {
      //       var nextSentence = element.context.parentElement.nextElementSibling;
      //       element.parent().removeClass('playing');
      //       angular.element(nextSentence).addClass('playing');
      //       nextSentence.lastElementChild.play();
      //       SentencesFactory.currentlyPlaying = nextSentence;
      //     });
      //   } else { // no next sentence
      //     element.bind('ended', function() {
      //       SentencesFactory.currentlyPlaying = null;
      //       element.parent().removeClass('playing');
      //     });
      //   }
      // });
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


/*
** Directive to show and hide the explanatory navbar.
*/
onceUpon.directive('navbarExpand', function($animate) {
  function link (scope, element, attrs) {
    element.bind('click', function() {
      var content = element.find('#navbar-content');
      var onceTitle = element.parent().find('#title-banner-wrap');
      var hudWrap = element.parent().find('#hud-wrapper');

      if (element.hasClass('expanded')) {
        $animate.removeClass(content, 'showing').then(function() {
          $animate.removeClass(element, 'expanded');
          $animate.removeClass(onceTitle, 'pushed');
          $animate.removeClass(hudWrap, 'pushed');
        });

      } else {
        $animate.addClass(onceTitle, 'pushed');
        $animate.addClass(hudWrap, 'pushed');
        $animate.addClass(element, 'expanded').then(function() {
          $animate.addClass(content, 'showing');
        });
      }

      scope.$apply(); // need to apply scope in all custom event handlers!
    });
  };

  return {
    restrict: 'A',
    scope: true,
    templateUrl: 'partials/navbar.html',
    link: link
  };
});



/*
** Directive to handle automatic scrolling of the sentences panel.
*/
onceUpon.directive('scroller', function($animate, SocketFactory) {
  function link (scope, element, attrs) {

    // If we get a new message, scroll down to it.
    scope.$watch(function() {
      return SocketFactory.hasNew;
    }, function(newVal, oldVal) {
      if (newVal === true) {
        // adding 300px to account for the padding added at the bottom of the
        // sentences panel
        element.animate({scrollTop:element[0].scrollHeight+300}, 1000);
      }
    });
  };

  return {
    restrict: 'A',
    scope: true,
    link: link
  };
});



// Directive to handle audio playback
onceUpon.directive('playback', function($animate) {
  function link (scope, element, attrs) {
    console.dir(element);
    console.dir(attrs);
    console.dir(element[0].children.length);
    console.dir(attrs.$$element[0].children[0]);

  };

  return {
    restrict: 'A',
    scope: true,
    link: link
  };
});
