onceUpon.factory('SentencesFactory', function SentencesFactory($http) {
  /* This factory is what negotiates between the front-end UI in angular
  ** and the backend API written in Node/Express.
  ** Angular doesn't communicate with MongoDB directly; rather, it sends
  ** and receives JSON objects to the Express API which then does the
  ** actual database calls.
  */

  var factory = {};
  factory.sentences = [];

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

  return factory;
});
