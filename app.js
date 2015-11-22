var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


// Set up mongoose by loading our data models
// Must be before routes, users and app
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/once');
require('./models/Sentence');


var routes = require('./routes/index');
// var socketLogic = require('./routes/socket-logic');
var users = require('./routes/users');

var app = express();
var server = app.listen(3000, function() {
  console.log("Server started on port 3000");
});
var io = require('socket.io').listen(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// Allow larger data to be sent
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);






// socket stuff - move elsewhere eventually
var connected = [];
// console.dir(io);

io.on('connection', function(socket) {
  connected.push(socket);
  // Put new user in the appropriate room
  checkStatus(socket);
  // console.log('io follows:');
  // console.dir(io);
  console.log('got a connection');

  console.log('users connected:');
  connected.forEach(function(socket) {
    console.log(socket.id);
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

// server.listen(3001, function() {
//   console.log('sockets listening on *:3001');
// })


var checkStatus = function(socket) {
  if (connected.length === 1) {
    socket.join('active');
    socket.leave('waiting');
    // if socket is in waiting room remove it here!!
    io.to(socket.id).emit('status', 'active');
  } else {
    socket.join('waiting');
    io.to(socket.id).emit('status', 'waiting in position ' + (connected.length - 1));
  }
}












// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
