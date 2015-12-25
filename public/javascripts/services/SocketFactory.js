onceUpon.factory('SocketFactory', function SocketFactory(SentencesFactory,
$rootScope, $timeout) {
  var factory = {};
  var socket;

  factory.userPosition = null;
  factory.totalUsers = null;
  factory.remainingTime = null;

  factory.currentMessage = {
    userId: null,
    inProgress: false,
    text: null
  };

  // factory.countdownClock;
  factory.countingDown = false;



  /////////////////////// Logic to send outgoing socket messages to the server
  // This user just began recording, tell the server so it can tell everyone
  factory.beginRecording = function() {
    // if the user has begun recording, stop the clock and clear the time on it
    $rootScope.$apply(function() {
      // clearInterval(factory.countdownClock);
      factory.countingDown = false;
    });

    var newMsg = {
      userId: socket.io.engine.id,
      inProgress: true,
      text: null
    };
    socket.emit('begin recording', newMsg);
    factory.currentMessage = newMsg;
  }

  // This user just recorded new text, tell the server so it can tell everyone
  factory.updateText = function(currentText) {
    var newMsg = {
      userId: socket.io.engine.id,
      inProgress: true,
      text: currentText
    };
    socket.emit('word', newMsg);
    factory.currentMessage = newMsg;
  }

  // This user just finished recording, tell the server so it can tell everyone
  factory.endRecording = function() {
    var newMsg = {
      userId: socket.io.engine.id,
      inProgress: false,
      text: null
    };
    socket.emit('end recording', newMsg);
    factory.currentMessage = newMsg;
  }


  // This gets called when a user becomes active. They have 30 seconds to think
  // about what they want to say before starting the recording.
  factory.countdownToRecord = function() {
    // Reset countdown first to make sure we don't have any lingering data
    var countdownClock;
    var count = 30;
    factory.countingDown = true;

    var updateCountdown = function() {
      // check first if elsewhere we stopped counting bc user started recording
      // if so, turn off the clock and reset count
      if (!factory.countingDown) {
        count = 30;
        clearInterval(countdownClock);
        return; // just to make sure clock doesn't keep running
      }

      // Update remainingTime outside of factory
      $rootScope.$apply(function() {
        factory.remainingTime = count;
      });

      // If user has run out of time...
      if (count === 0) {
        $rootScope.$apply(function() {
          factory.countingDown = false;
        });

        var newMsg = {
          userId: socket.io.engine.id,
          inProgress: false,
          text: null
        };

        // Tell the server that the active contributor has lost their chance
        // and we should push them back to the end of the line
        socket.emit('countdown over', newMsg);

        clearInterval(countdownClock);
        return; // just to make sure clock doesn't keep running
      }

      // decrement count
      count--;
    }

    updateCountdown(); // run it once first to avoid delay
    countdownClock = setInterval(updateCountdown, 1000);
  }



  //////////////////// Logic to process incoming socket messages from the server
  angular.element(document).ready(function() {
    socket = io();

    // Update user status and conditionally start countdown
    socket.on('status', function(msg) {
      // only start the countdown if a) this socket is 1st,
      // b) there are other users, and
      // c) we're not already counting down
      if ((msg.userPosition == 0) && (msg.totalUsers !== 1) && (!factory.countingDown)) {
        factory.countdownToRecord();
      }

      // Every custom event handler needs to apply its scope
      // Syntax is a bit different in service
      $rootScope.$apply(function() {
        factory.userPosition = msg.userPosition; // 'waiting' or 'active'
        factory.totalUsers = msg.totalUsers; // waiting position or other info
      });
    });

    // Logic to process pushed live recordings from other users
    socket.on('begin recording', function(msg) {
      $rootScope.$apply(function() {
        factory.currentMessage.text = null;
        factory.currentMessage.inProgress = true;
        factory.currentMessage.userId = msg.userId;
      });
    });

    // Display a word that we've gotten from another client via the server
    socket.on('word', function(msg) {
      $rootScope.$apply(function() {
        factory.currentMessage.text = msg.text;
      });
    });

    // Whoever was recording has finished, so we should get new messages
    socket.on('end recording', function(msg) {
      $rootScope.$apply(function() {
        factory.currentMessage.inProgress = false;
        factory.currentMessage.text = null;
        SentencesFactory.getNew();
        // TODO: move this to directive later
        $("#sentences-panel").animate({scrollTop:$("#sentences-panel")[0].scrollHeight}, 1000);
      });
    });
  });

  return factory;
});
