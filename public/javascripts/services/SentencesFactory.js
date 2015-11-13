onceUpon.factory('SentencesFactory', function SentencesFactory($http) {
  /* This factory is what negotiates between the front-end UI in angular
  ** and the backend API written in Node/Express.
  ** Angular doesn't communicate with MongoDB directly; rather, it sends
  ** and receives JSON objects to the Express API which then does the
  ** actual database calls.
  */

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
        $.ajax({
          type: 'POST',
          url: '/saveRecording',
          data: {
            audio: event.target.result,
            text: text,
            timestamp: new Date()
          },
          dataType: 'json'

        }).done(function(data) {
          console.log(data);

          // Not sure this is the fastest way to do it,
          // but it does work to make sure the display is updated when
          // a new sentence is added.
          factory.getAll();
        });
      }
      reader.readAsDataURL(blob);
    });
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
