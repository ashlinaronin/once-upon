onceUpon.controller('RecordCtrl', function RecordCtrl($scope, SentencesFactory, $http) {
    // recorder object must be scoped to the whole controller
    $scope.rec;
    $scope.context;
    $scope.mediaStreamSource;

    $scope.SentencesFactory = SentencesFactory;

    $scope.start = function() {
      $scope.rec.record();
      console.log('recording');
    }

    $scope.save = function() {
      $scope.rec.stop();

      // Factory will do the actual work of saving the recording
      // We pass it the recorder object to do so
      $scope.SentencesFactory.saveSentence($scope.rec, $scope.text);
    }

    // getUserMedia success and error callbacks
    var gumSuccess = function (stream) {
      // Support various implementations of AudioContext
      $scope.context = new (window.AudioContext || window.webkitAudioContext)();
      $scope.mediaStreamSource = $scope.context.createMediaStreamSource(stream);
      $scope.rec = new Recorder($scope.mediaStreamSource);
    }
    var gumError = function (err) {
      console.log('The following getUserMedia error occured: ' + err);
    }


    // Initialize microphone when this partial is loaded
    angular.element(document).ready(function() {
      // Support multiple browser implementations of getUserMedia
      navigator.getUserMedia = (navigator.getUserMedia ||
                                navigator.webkitGetUserMedia ||
                                navigator.mozGetUserMedia ||
                                navigator.msGetUserMedia);

      navigator.getUserMedia(
        {audio:true, video: false},
        gumSuccess, gumError
      );
    });
});
