onceUpon.controller('SentencesCtrl', function SentencesCtrl($scope, SentencesFactory) {
    // Mirror the array of posts returned by the factory
    $scope.sentences = SentencesFactory.sentences;

    $scope.addSentence = function() {
      console.log('in $scope.addSentence, $scope.text is ' + $scope.text);
      if ($scope.text) {
        SentencesFactory.create({
          text: $scope.text
        });

        // Clear text box after adding new sentence
        $scope.text = '';
      }
    }

});
