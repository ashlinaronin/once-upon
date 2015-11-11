// help from here
// http://stackoverflow.com/questions/15014638/recorderjs-uploading-recorded-blob-via-ajax

onceUpon.controller('RecordCtrl', function RecordCtrl($scope, SentencesFactory) {
    // Mirror the array of posts returned by the factory
    $scope.sentences = SentencesFactory.sentences;

    // recorder object must be scoped to the whole controller
    $scope.rec;
    // $scope.config = {callback: $scope.blobCallback}
    $scope.context;
    $scope.mediaStreamSource;

    // create a message var just to send info to the client
    $scope.message;

    $scope.object = new Object();
    $scope.object.sendToServer = true;

    $scope.start = function() {
      $scope.rec.record();
      console.log('recording');
    }

    $scope.export = function() {
      $scope.rec.stop();
      console.log('stopped recording');

      $scope.rec.exportWAV(function blobCallback(blob) {
        $scope.rec.clear();

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
            dataType: 'text'
          }).done(function(data) {
            console.log(data);
          });
        }
        reader.readAsDataURL(blob);
      });
    }



    var successCallback = function (stream) {
      // Support various implementations of AudioContext
      $scope.context = new (window.AudioContext || window.webkitAudioContext)();
      $scope.mediaStreamSource = $scope.context.createMediaStreamSource(stream);
      $scope.rec = new Recorder($scope.mediaStreamSource);

      // debugger;
    }

    var errorCallback = function (err) {
      console.log('The following getUserMedia error occured: ' + err);
    }

    // Wrap code in document ready to run only when this partial is done loading
    angular.element(document).ready(function() {

      // Support multiple browser implementations of getUserMedia
      navigator.getUserMedia = (navigator.getUserMedia ||
                                navigator.webkitGetUserMedia ||
                                navigator.mozGetUserMedia ||
                                navigator.msGetUserMedia);

      navigator.getUserMedia(
        {audio:true, video: false},
        successCallback, errorCallback
      );


    });
});
