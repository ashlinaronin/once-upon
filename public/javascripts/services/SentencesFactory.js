onceUpon.factory('SentencesFactory', function SentencesFactory($http, $rootScope) {
  /* This factory is what negotiates between the front-end UI in angular
  ** and the backend API written in Node/Express.
  ** Angular doesn't communicate with MongoDB directly; rather, it sends
  ** and receives JSON objects to the Express API which then does the
  ** actual database calls.
  */

  var factory = {};
  factory.sentences = [];
  factory.latestTimestamp = null;
  factory.currentlyPlaying = null;

  var liblame = new lamejs();

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
          // SocketFactory.endRecording();
          // factory.getAll();
          // console.log('file reader finished reading blob');
        }, function errorCallback(response) {
          // Called when an error occurs
          console.log('Error saving audio file: ' + response);
        });
      }
      reader.readAsDataURL(blob);
    });
  }

  factory.encodeMono = function(channels, sampleRate, samples) {
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
        console.log('done encoding, size=', buffer.length);
        var blob = new Blob(buffer, {type: 'audio/mp3'});
        var bUrl = window.URL.createObjectURL(blob);
        console.log('Blob created, URL:', bUrl);
        window.myAudioPlayer = document.createElement('audio');
        window.myAudioPlayer.src = bUrl;
        window.myAudioPlayer.setAttribute('controls', '');
        // window.myAudioPlayer.play();
    }

  factory.saveToMP3 = function(recorder, text) {
    recorder.exportWAV(function blobCallback(blob) {
      // Read the blob as array buff and send to liblame
      var reader = new FileReader();
      reader.onload = function(event) {
        console.dir(event.target.result);
        var wav = liblame.WavHeader.readHeader(new DataView(event.target.result));
        console.dir(wav);
        samples = new Int16Array(event.target.result, wav.dataOffset, wav.dataLen / 2);
        factory.encodeMono(wav.channels, wav.sampleRate, samples);
      }, function errorCallback(response) {
          // Called when an error occurs
          console.log('Error saving audio file: ' + response);
      };
      reader.readAsArrayBuffer(blob);
      // console.log('wav:', wav);
      // console.log('txt:', txt);
    });
  }

  /* Get all sentences and deep copy them to update the factory. */
  factory.getAll = function() {
    return $http.get('/sentences').success(function(data) {
      // Create a deep copy of the return data so it will be updated everywhere
      // Not really sure this is necessary/'best practice'?
      // angular.copy(data, factory.sentences);
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
