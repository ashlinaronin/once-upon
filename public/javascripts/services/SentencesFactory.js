onceUpon.factory('SentencesFactory', function SentencesFactory($http) {
  /* This factory is what negotiates between the front-end UI in angular
  ** and the backend API written in Node/Express.
  ** Angular doesn't communicate with MongoDB directly; rather, it sends
  ** and receives JSON objects to the Express API which then does the
  ** actual database calls.
  */

  var factory = {};
  factory.sentences = [];

  var lookup = {};


  // // This will be key-value pairs where key = sentenceId and val =
  // factory.audioFiles = {};

  /* Add this sentence by sending it to the Node server API
  ** at /sentences via an HTTP POST request. */
  factory.create = function(sentence) {
    return $http.post('/sentences', sentence, {})
      .success(function(data) {
        factory.sentences.push(data);
      });
  }

  /* Get all sentences and deep copy them to update the factory. */
  factory.getAll = function() {
    return $http.get('/sentences').success(function(data) {
      // Create a deep copy of the return data so it will be updated everywhere
      angular.copy(data, factory.sentences);
    });
  }

  // This may get slow, want to figure out how to speed things up
  // with streaming so we don't have to wait for it.
  // maybe this isn't done in factory at all....
  factory.getAudio = function(sentenceId) {
    return $http.get('/getRecording/' + sentenceId).success(function(data) {
      var thisSentence = $.grep(factory.sentences, function() {
        return (sentence._id === sentenceId);
      });

      thisSentence.audio = data;
      // why do we need angular copy?
      // angular.copy(data, factory.sentences[])
    });
  }

  return factory;
});
