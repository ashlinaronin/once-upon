onceUpon.factory('SentencesFactory', function SentencesFactory($http) {
  /* This factory is what negotiates between the front-end UI in angular
  ** and the backend API written in Node/Express.
  ** Angular doesn't communicate with MongoDB directly; rather, it sends
  ** and receives JSON objects to the Express API which then does the
  ** actual database calls.
  */
  var liblame = new lamejs();

  var factory = {};
  factory.sentences = [];

  // Moved this from the RecordCtrl to the factory so stuff will be updated
  // Should probably use angular's built in http instead of jquery!
  factory.saveSentence = function(recorder, text) {
    recorder.exportWAV(function blobCallback(blob) {
      recorder.clear();

      // Read the blob as data url and send it to the backend w/ ajax
      var reader = new FileReader();
      reader.onload = function(event) {
        $http({
          method: 'POST',
          url: 'saveRecording',
          data: {
            audio: event.target.result,
            text: text,
            timestamp: new Date()
          }
        }).then(function successCallback(response) {
          console.log(response);
          factory.getAll();
        }, function errorCallback(response) {
          // Called when an error occurs
          console.log(response);
        });
      }
      reader.readAsDataURL(blob);
    });
  }

  // from example at github.com/zhuker/lamejs
  factory.encodeMonoMp3 = function(channels, sampleRate, samples) {
    var buffer = [];
    mp3enc = new liblame.Mp3Encoder(channels, sampleRate, 128);
    var remaining = samples.length;
    var maxSamples = 1152;
    for (var i = 0; remaining >= maxSamples; i += maxSamples) {
      var mono = samples.subarray(i, i + maxSamples);
      var mp3buf = mp3enc.encodeBuffer(mono);
      if (mp3buf.length > 0) {
        buffer.push(new Int8Array(mp3buf));
      }
      remaining -= maxSamples;
    }
    var d = mp3enc.flush();
    if (d.length > 0) {
      buffer.push(new Int8Array(d));
    }

    console.log('done encoding mp3, size=', buffer.length);
    var blob = new Blob(buffer, {type: 'audio/mp3'});
    var bUrl = window.URL.createObjectURL(blob);
    console.log('Blob created, URL:', bUrl);
    // In the example, he puts the file here to play it, but we dont wanna
  }

  // from example at github.com/zhuker/lamejs
  factory.loadWav = function() {
    var wavFile = "test.wav";

    var request = new XMLHttpRequest();
    request.open("GET", wavFile, true);
    request.responseType = "arraybuffer";

    // our asynchronous callback
    request.onload = function() {
      audioData = request.response;
      wav = liblame.Wavheader.readHeader(new DataView(audioData));
      console.log('wav: ' wav);
      samples = new Int16Array(audioData, wav.dataOffset, wav.dataLen / 2);
      factory.encodeMp3(wav.channels, wav.sampleRate, samples);
    }
    request.send();
  }

  /* Get all sentences and deep copy them to update the factory. */
  factory.getAll = function() {
    return $http.get('/sentences').success(function(data) {
      // Create a deep copy of the return data so it will be updated everywhere
      angular.copy(data, factory.sentences);
    });
  }


  return factory;
});
