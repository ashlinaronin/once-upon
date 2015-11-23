onceUpon.factory('SocketFactory', function SocketFactory($rootScope) {
  var factory = {};
  factory.userStatus = null;
  factory.currentMessage = {
    userId: null,
    inProgress: false,
    text: null
  };

  // When the page has loaded, fire up Socket.io client and listen for
  // status messages
  angular.element(document).ready(function() {
    var socket = io();

    socket.on('status', function(msg) {
      console.log('status from server: ' + msg);

      // Every custom event handler needs to apply its scope
      // Syntax is a bit different in service
      $rootScope.$apply(function() {
        factory.userStatus = msg;
      });
    });


    // Logic to process pushed live recordings
    socket.on('begin recording', function(msg) {
      $rootScope.$apply(function() {
        factory.currentMessage.inProgress = true;
        factory.currentMessage.userId = msg.userId;
      });
    });

    socket.on('word', function(msg) {
      $rootScope.$apply(function() {
        factory.currentMessage.text = msg.text;
      });
    });

    socket.on('end recording', function(msg) {
      $rootScope.$apply(function() {
        factory.currentMessage.inProgress = false;
      });
    });
  });

  return factory;
});
