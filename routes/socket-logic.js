var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var connected = [];

io.on('connection', function(socket) {

  // Put new user in the appropriate room
  checkStatus(socket);
  console.log('io follows:');
  console.dir(io);

  connected.push(socket);
  console.log(connected.length + ' users connected');


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
  if (connected.length === 0) {
    socket.join('active');
    socket.leave('waiting');
    // if socket is in waiting room remove it here!!
    io.to(socket.id).emit('status', 'active');
  } else {
    socket.join('waiting');
    io.to(socket.id).emit('status', 'waiting in position ' + connected.length);
  }
}
