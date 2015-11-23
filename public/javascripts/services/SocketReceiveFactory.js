onceUpon.factory('SocketReceiveFactory', function SocketReceiveFactory(SentencesFactory,
$rootScope, $timeout) {
  var factory = {};
  factory.socket;

  factory.userStatus = null;
  factory.currentMessage = {
    userId: null,
    inProgress: false,
    text: null
  };


  // When the page has loaded, fire up Socket.io client and listen for
  // status messages
  angular.element(document).ready(function() {
    socket = io();

    socket.on('status', function(msg) {
      // Every custom event handler needs to apply its scope
      // Syntax is a bit different in service
      $rootScope.$apply(function() {
        factory.userStatus = msg;
      });
    });


    // Logic to process pushed live recordings from other users
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

        // maybe it's just taking awhile to save the recordings
        // so let's try with a timeout here
        if (msg.userId === socket.io.engine.id) {
          console.log('i ended teh recording');

        } else {
          console.log('somebody else ended the recording, so im gonna get all now');
          SentencesFactory.getAll();
        }
      });
    });
  });

  return factory;
});
