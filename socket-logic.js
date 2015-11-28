var setup = function(io, PubSub) {
  var recordQueue = [];

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
    // Assume user will be waiting by default
    recordQueue.push(socket);
    checkStatusAndEmitMessage(socket);

    console.log('got a connection, users connected:');
    recordQueue.forEach(function(socket) {
      console.log(socket.id);
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

    socket.on('disconnect', function() {
      // Take this socket out of the queue
      var queuePosition = recordQueue.indexOf(socket);
      if (queuePosition > -1) {
        recordQueue.splice(queuePosition, 1);
      } else {
        console.log('some weird error with socket disconnection');
      }

      console.log(socket.id + ' disconnected');

      // now that somebody disconnected, we should check everybody else's status
      updateAllSocketStatuses();
      console.log(recordQueue.length + ' users connected');
    });



  });

  var updateAllSocketStatuses = function() {
    recordQueue.forEach(function(socket) {
      checkStatusAndEmitMessage(socket);
    });
  }

  // Check user status for a particular socket and send it a message telling
  // its current status
  // Eventually want to change this to send just the index of the waiting
  // socket so we don't have to parse string, but for now it's easier to read
  var checkStatusAndEmitMessage = function(socket) {
    if (recordQueue.indexOf(socket) === 0) {
      io.to(socket.id).emit('status', 'active');
    } else {
      io.to(socket.id).emit('status',
        'waiting in position ' + recordQueue.indexOf(socket));
    }
  }

}

module.exports = setup;
