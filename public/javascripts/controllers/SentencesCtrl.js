onceUpon.controller('SentencesCtrl', function SentencesCtrl($scope, SentencesFactory) {
    // Mirror the array of posts returned by the factory
    $scope.sentences = SentencesFactory.sentences;

    // Keep track of the currently playing sentence
    $scope.playing = null;

    $scope.addSentence = function() {
      console.log('in $scope.addSentence, $scope.text is ' + $scope.text);
      if ($scope.text) {
        SentencesFactory.create({
          text: $scope.text,
          timestamp: new Date()
        });

        // Clear text box after adding new sentence
        $scope.text = '';
      }
    }

    // Handlers to play/pause audio on mouseover/mouseleave
    $scope.playAudio = function(event) {
      event.target.nextElementSibling.play();
    }

    $scope.pauseAudio = function(event) {
      event.target.nextElementSibling.pause();
    }

    // Play back story from whichever list item we're at
    $scope.playFrom = function(event) {
      // console.dir(event.target);
    }

}); // end controller
