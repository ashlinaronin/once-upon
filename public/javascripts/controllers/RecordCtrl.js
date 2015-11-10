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
        console.log('in blobback');

        if ($scope.object.sendToServer) {
          console.log('in if');
          // Create an Object url
          var url = (window.URL || window.webkitURL).createObjectURL(blob);

          console.dir(url);
          // Create a new ajax request and send it via the ObjectURL
          var request = new XMLHttpRequest();

          // what are these parameters exactly?
          request.open("GET", url, true);
          request.responseType = blob;
          request.onload = function() {
            // we have a blob
            console.dir(request.response);
          }
          request.send();
        }
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
