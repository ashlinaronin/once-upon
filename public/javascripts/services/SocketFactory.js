onceUpon.factory('SocketFactory', function SocketFactory(SentencesFactory,
$rootScope, $timeout) {
  var factory = {};
  var socket;


  factory.userStatus = null;
  factory.currentMessage = {
    userId: null,
    inProgress: false,
    text: null
  };

  // logic to send messages from this user
  factory.beginRecording = function() {
    var newMsg = {
      userId: socket.io.engine.id,
      inProgress: true,
      text: null
    };
    socket.emit('begin recording', newMsg);
    factory.currentMessage = newMsg;
  }

  factory.updateText = function(currentText) {
    var newMsg = {
      userId: socket.io.engine.id,
      inProgress: true,
      text: currentText
    };
    socket.emit('word', newMsg);
    factory.currentMessage = newMsg;
  }

  factory.endRecording = function() {
    var newMsg = {
      userId: socket.io.engine.id,
      inProgress: false,
      text: null
    };
    socket.emit('end recording', newMsg);
    factory.currentMessage = newMsg;
  }



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

    // Whoever was recording has finished, so we should get new messages
    socket.on('end recording', function(msg) {
      $rootScope.$apply(function() {
        factory.currentMessage.inProgress = false;
        SentencesFactory.getNew();
      });
    });
  });

  return factory;
});
