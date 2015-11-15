onceUpon.controller('RecordCtrl', function RecordCtrl($scope, SentencesFactory, $http) {
    $scope.SentencesFactory = SentencesFactory;

    // recorder object must be scoped to the whole controller
    $scope.rec;
    $scope.context;
    $scope.mediaStreamSource;

    // Recognition object scoped to the whole controller
    $scope.recognition;
    $scope.interim;
    $scope.chunks = [];
    $scope.final = null;
    $scope.recognizing = false;

    $scope.start = function() {
      $scope.rec.record();
      $scope.recognition.start();
      console.log('recording');
    }

    $scope.save = function() {
      $scope.rec.stop();
      $scope.recognition.stop();

      // Factory will do the actual work of saving the recording
      // We pass it the recorder object to do so
      $scope.SentencesFactory.saveSentence($scope.rec, $scope.text);
    }

    // Initialize Speech Recognition object
    $scope.initRecognize = function() {
      if ('webkitSpeechRecognition' in window) {
        $scope.recognition = new webkitSpeechRecognition();

        // We want to see the interim results
        $scope.recognition.interimResults = true;

        // Don't continue speech recognition if user pauses
        // Because they only have one shot to record anyway...?
        $scope.recognition.continuous = false;

        // Using American English for now
        $scope.recognition.lang = 'en-US';

        // Do these things when speech recognition is enabled
        $scope.recognition.onstart = function() {
          console.log('started recognition');
          $scope.recognizing = true;

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
            $scope.$apply();
          } else {
            $scope.final = sentence;
            // $scope.heardSentences.push(sentence);

            // Set the text to this sentence transcription
            // and save all to the db
            $scope.text = sentence;
            $scope.save();

            // We've got a final result, clear the interim results.
            $scope.interim = null;
            $scope.final = null;

            // We're done, stop the voice recognition.
            // (Now we don't want to stop because it's continuous)
            // we could stop if user presses a button maybe
            // if ($scope.recognizing) {
            //   $scope.recognition.stop();
            // }

            // Every custom handler needs to apply its scope
            $scope.$apply();
          }
        };

        $scope.recognition.onerror = function(event) {
          if (event.error === "not-allowed") {
            $scope.message = "I'm sorry, what was that?";
            console.log("error not allowed");
          } else {
            $scope.message = "I'm sorry!! Something went wrong.";
            console.log("other error");
          }

          // Every custom event handler needs to apply its scope
          $scope.$apply();
        };

        $scope.recognition.onend = function() {
          $scope.recognizing = false;
          // console.log("recognition ended");

          // do more in here?
          // here's a hack to re-start recognition after the preset time limit
          // recognition.start();

          // Every custom event handler needs to apply its scope
          $scope.$apply();
        };


      } else {
        // webkitSpeechRecognition not found
        $scope.message = "Please use the latest version of Google Chrome.";
        window.setTimeout(function() {}, 1000);
      };
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

      // Initialize the speech recognition object,
      // but don't start recognition yet
      // We start that along with recording when user pressed button
      $scope.initRecognize();
    });
});
