onceUpon.controller('SentencesCtrl', function SentencesCtrl($scope, SentencesFactory) {
    // Mirror the array of posts returned by the factory
    $scope.sentences = SentencesFactory.sentences;

    // Play/pause handlers moved to directives
    // Because controllers should not manipulate the DOM

}); // end controller
