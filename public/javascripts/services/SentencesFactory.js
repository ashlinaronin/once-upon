onceUpon.factory('SentencesFactory', function SentencesFactory($http, $rootScope) {
  /* This factory is what negotiates between the front-end UI in angular
  ** and the backend API written in Node/Express.
  ** Angular doesn't communicate with MongoDB directly; rather, it sends
  ** and receives JSON objects to the Express API which then does the
  ** actual database calls.
  */

  var factory = {};
  var liblame = new lamejs();
  factory.sentences = [];
  factory.latestTimestamp = null;
  factory.currentlyPlaying = null;

  // Given recorder object, export a wav blob, read it and pass it to mp3 encoder
  factory.saveSentence = function(recorder, text) {
    recorder.exportWAV(function blobCallback(blob) {
      recorder.clear();

      // Read WAV blob, then send it to MP3 encoder
      var reader = new FileReader();
      reader.onload = function(event) {
        var wav = liblame.WavHeader.readHeader(new DataView(event.target.result));
        samples = new Int16Array(event.target.result, wav.dataOffset, wav.dataLen / 2);
        factory.encodeMonoMP3(wav.channels, wav.sampleRate, samples);
      };
      reader.readAsArrayBuffer(blob);
    });
  }

  // Actually encode the MP3 using LAMEjs.
  // Help from https://github.com/zhuker/lamejs/blob/master/example.html
  factory.encodeMonoMP3 = function(channels, sampleRate, samples) {
    var buffer = [];
    mp3enc = new liblame.Mp3Encoder(channels, sampleRate, 192);
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
    if(d.length > 0){
        buffer.push(new Int8Array(d));
    }
    var blob = new Blob(buffer, {type: 'audio/mp3'});
    factory.saveMP3ToDB(blob);
  }

  // Take encoded mp3 blob and send it to backend to be saved to DB
  factory.saveMP3ToDB = function(blob) {
    var reader = new FileReader();
    reader.onload = function(event) {
      $http({
        method: 'POST',
        url: 'saveRecording',
        data: {
          audio: event.target.result,
          text: 'test',
          timestamp: new Date()
        }
      }).then(function successCallback(response) {
        // Do something after http post req goes through
      }, function errorCallback(response) {
        console.log('Error saving MP3 file to db: ' + response);
      });
    }
    reader.readAsDataURL(blob);
  }


  /* Get all sentences and deep copy them to update the factory. */
  factory.getAll = function() {
    return $http.get('/sentences').success(function(data) {
      factory.sentences = data;
      factory.latestTimestamp =
        factory.sentences[factory.sentences.length-1].timestamp;
    });
  }

  // Get new sentences and add them to factory.sentences array
  // Then update latest timestamp so next time we don't get extra sentences
  factory.getNew = function() {
    if (factory.latestTimestamp) {
      return $http.get('/sentences/new/' + factory.latestTimestamp)
        .success(function(data) {
          factory.sentences = factory.sentences.concat(data);
          factory.latestTimestamp = new Date().toISOString();
      });
    } else {
      return factory.getAll();
    }
  }


  return factory;
});
