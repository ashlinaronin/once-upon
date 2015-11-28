var setup = function(io, PubSub) {
  var connected = [];

  var onAudioFileUploadedSubscriber = function(msg, data) {
    console.log("onAudioFileUploadedSubscriber: " + msg);
    io.emit('end recording');
  }

  var token = PubSub.subscribe('FILE_AUDIO_UPLOADED', onAudioFileUploadedSubscriber);


  io.on('connection', function(socket) {
    connected.push(socket);

    // Put new user in the appropriate room
    checkStatus(socket);

    console.log('got a connection, users connected:');
    connected.forEach(function(socket) {
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
      console.log(socket.id + ' disconnected');
      connected.splice(connected.indexOf(socket), 1);

      // now that somebody disconnected, we should check everybody else's status
      connected.forEach(function(socket) {
        checkStatus(socket);
      });
      console.log(connected.length + ' users connected');
    });
  });



  var checkStatus = function(socket) {
    // If this socket is number one in line now, set it to active
    if (connected.indexOf(socket) === 0) {
      socket.leave('waiting');
      socket.join('active');
      // if socket is in waiting room remove it here!!
      io.to(socket.id).emit('status', 'active');
    } else {
      socket.join('waiting');
      io.to(socket.id).emit('status', 'waiting in position ' + (connected.length - 1));
    }
  }

}

module.exports = setup;
