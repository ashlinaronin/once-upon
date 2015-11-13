onceUpon.controller('RecordCtrl', function RecordCtrl($scope, SentencesFactory, $http) {
    // recorder object must be scoped to the whole controller
    $scope.rec;
    $scope.context;
    $scope.mediaStreamSource;

    $scope.start = function() {
      $scope.rec.record();
      console.log('recording');
    }

    $scope.saveRecording = function() {
      $scope.rec.stop();
      console.log('stopped recording');

      $scope.rec.exportWAV(function blobCallback(blob) {
        $scope.rec.clear();

        // Read the blob as data url and send it to the backend w/ ajax
        var reader = new FileReader();
        reader.onload = function(event) {
          $.ajax({
            type: 'POST',
            url: '/saveRecording',
            data: {
              audio: event.target.result,
              text: $scope.text,
              timestamp: new Date()
            },
            dataType: 'json'

          }).done(function(data) {
            console.log(data);
          });
        }
        reader.readAsDataURL(blob);
      });
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
