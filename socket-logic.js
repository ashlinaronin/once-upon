var setup = function(io, PubSub) {
  var recordQueue = [];
  var leechers = [];

  // Called when Mongo db tells us via PubSub that audio upload finished
  var onAudioFileUploadedSubscriber = function(msg, data, socket) {
    console.log("onAudioFileUploadedSubscriber: " + msg);

    // Send the message to everyone that the recording has finished
    io.emit('end recording');

    // we move the active user to the end of the queue and send everybody
    // a message telling them their new status
    recordQueue.push(recordQueue.shift());
    updateAllSocketStatuses();
  };

  var token = PubSub.subscribe('FILE_AUDIO_UPLOADED', onAudioFileUploadedSubscriber);


  io.on('connection', function(socket) {
    // Before putting user into a queue, ask for some information about the client
    io.to(socket.id).emit('record capability query');

    socket.on('record capability response', function(msg) {
      if (msg.canRecord) {
        // Assume user will be waiting by default
        recordQueue.push(socket);

        // Update everyone's status so ppl can see there is a new connection
        updateAllSocketStatuses();

        console.log('got a new recorder, recorders connected:');
        recordQueue.forEach(function(socket) {
          console.log(socket.id);
        });
      } else {
        // For the time being, just keep track of non-recording users in a separate queue
        leechers.push(socket);

        console.log('got a new leecher, leechers connected:');
        leechers.forEach(function(socket) {
          console.log(socket.id);
        });
      }
    });






    // maybe can refactor these three...
    // if we get a begin recording msg, pass it on to everyone
    socket.on('begin recording', function(msg) {
      console.log(msg.userId + ' began recording');
      io.emit('begin recording', msg);
    });

    // if we get a word, pass it on to everyone
    socket.on('word', function(msg) {
      console.log('got word ' + msg.text);
      io.emit('word', msg);
    });

    // if we get an end recording msg, pass it on to everyone
    socket.on('end recording', function(msg) {
      io.emit('end recording', msg);
    });

    // this means the user lost their chance to record, bump em in line
    socket.on('countdown over', function(msg) {
      // we might as well send this msg to everyone for potential future use
      io.emit('countdown over', msg);
      recordQueue.push(recordQueue.shift());
      updateAllSocketStatuses();
    });

    socket.on('disconnect', function() {
      // Take this socket out of the queue
      var queuePosition = recordQueue.indexOf(socket);
      if (queuePosition > -1) {
        recordQueue.splice(queuePosition, 1);
      } else {
        console.log('Socket disconnection error');
      }

      console.log(socket.id + ' disconnected');

      // now that somebody disconnected, we should check everybody else's status
      updateAllSocketStatuses();
      console.log(recordQueue.length + ' users connected');
    });



  });

  // Every time we update all socket statuses, tell everyone how many people are waiting
  // When we update all socket statuses, don't need to deal with the leechers,
  // just update people waiting to record.
  var updateAllSocketStatuses = function() {
    recordQueue.forEach(function(socket) {
      checkStatusAndEmitMessage(socket);
    });
  }


  // Send this socket a message detailing its current waiting position and total
  // number of users
  var checkStatusAndEmitMessage = function(socket) {
    io.to(socket.id).emit('status', {
      userPosition: recordQueue.indexOf(socket),
      totalUsers: recordQueue.length
    });
  }

}

module.exports = setup;
