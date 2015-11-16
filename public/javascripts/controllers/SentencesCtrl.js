onceUpon.controller('SentencesCtrl', function SentencesCtrl($scope, SentencesFactory) {
    // Mirror the array of posts returned by the factory
    $scope.sentences = SentencesFactory.sentences;

    // Keep track of the currently playing sentence
    $scope.playing = null;

    // These handlers should actually all be directives
    // Because controllers should not manipulate the DOM
    // Handlers to play/pause audio on mouseover/mouseleave
    $scope.playAudio = function(event) {
      event.target.nextElementSibling.play();
    }

    $scope.pauseAudio = function(event) {
      event.target.nextElementSibling.pause();
    }

    // Play back story from whichever list item we're at
    $scope.playFrom = function(event) {
      console.dir(event.target);
    }

}); // end controller
