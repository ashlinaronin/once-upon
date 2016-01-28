onceUpon.controller('RecordCtrl', function RecordCtrl($scope, SentencesFactory,
      SocketFactory, PlaybackFactory, $http) {
    $scope.SentencesFactory = SentencesFactory;
    $scope.SocketFactory = SocketFactory;
    $scope.PlaybackFactory = PlaybackFactory;

    $scope.$watch(function() {
      return PlaybackFactory.playing;
    }, function(newVal, oldVal) {
      console.log(newVal);
      $scope.PlaybackFactory.playing = newVal;
    });

    // Recorder, context, and recognition objects must be scoped to the whole controller
    $scope.rec;
    $scope.context;
    $scope.mediaStreamSource;
    $scope.recognition;

    // Keep track of current sentence values and state
    $scope.interim;
    $scope.final = null;
    $scope.recognizing = false;

    $scope.getButtonClass = function() {
      if ($scope.SocketFactory.userPosition === 0 && !$scope.recognizing) {
        return "ready";
      } else if ($scope.SocketFactory.userPosition === 0 && $scope.recognizing) {
        return "recording";
      } else if ($scope.SocketFactory.userPosition !== 0) {
        return "waiting";
      }
    }

    $scope.start = function() {
      PlaybackFactory.stopAll(); // stop all playback when recording starts
      $scope.rec.record();
      $scope.recognition.start();
    }

    $scope.save = function() {
      $scope.rec.stop();
      $scope.recognition.stop();

      // Factory will do the actual work of saving the recording
      // We pass it the recorder object to do so
      $scope.SentencesFactory.saveSentence($scope.rec, $scope.text);
    }

    // Initialize Speech Recognition object and handlers
    var initRecognize = function() {
      if (!('webkitSpeechRecognition' in window)) {
        console.log("Your browser does not support speech recognition. Please use the latest version of Google Chrome.");
      } else {
        $scope.recognition = new webkitSpeechRecognition();

        // We want to see the interim results
        $scope.recognition.interimResults = true;

        // Don't continue speech recognition if user pauses
        // Because as it is now, they have one opportunity to record
        $scope.recognition.continuous = false;

        // Using American English for now
        $scope.recognition.lang = 'en-US';

        // Do these things when speech recognition is enabled
        $scope.recognition.onstart = function() {
          $scope.recognizing = true;
          $scope.SocketFactory.beginRecording();

          // Every custom event handler needs to apply its scope
          $scope.$apply();
        };

        // Do these things when the user has finished talking
        $scope.recognition.onresult = function (event) {
          // Get index of this sentence relative to all the sentence events
          // recorded while the user has been on this page
          var sentenceIndex = event.resultIndex;

          // Get sentence from transcript of the most current interim results
          var sentence = event.results[sentenceIndex][0].transcript;

          // Display interim results
          if (!event.results[sentenceIndex].isFinal) {
            $scope.interim = sentence;
            $scope.SocketFactory.updateText(sentence);
            $scope.$apply();
          } else {
            $scope.final = sentence;

            // Set the text to this sentence transcription
            // and save all to the db
            $scope.text = sentence;
            $scope.save();

            // Send a socket message to the server to tell everyone that this
            // user has finished recording
            $scope.SocketFactory.endRecording();

            // We've got a final result, clear the interim results.
            $scope.interim = null;
            $scope.final = null;

            // Every custom handler needs to apply its scope
            $scope.$apply();
          }
        };

        $scope.recognition.onerror = function(event) {
          if (event.error === "not-allowed") {
            console.log("Speech recognition not allowed");
          } else {
            console.log("Other speech recognition error");
          }

          // Every custom event handler needs to apply its scope
          $scope.$apply();
        };

        $scope.recognition.onend = function() {
          $scope.recognizing = false;

          // Here's a hack to re-start recognition after the preset time limit
          // Disabled for now because we are using a short input window
          // recognition.start();

          // Every custom event handler needs to apply its scope
          $scope.$apply();
        };
      }
    }

    // getUserMedia success and error callbacks
    var gumSuccess = function (stream) {
      // Support various implementations of AudioContext
      $scope.context = new (window.AudioContext || window.webkitAudioContext)();
      $scope.mediaStreamSource = $scope.context.createMediaStreamSource(stream);
      $scope.rec = new Recorder($scope.mediaStreamSource, {numChannels:1});
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
                                navigator.msGetUserMedia ||
                                navigator.mediaDevices.getUserMedia);

      navigator.getUserMedia(
        {audio:true, video: false},
        gumSuccess, gumError
      );

      // Initialize the speech recognition object,
      // but don't start recognition yet
      // We start that along with recording when user presses button
      initRecognize();
    });
});
