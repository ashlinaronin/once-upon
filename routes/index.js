var express = require('express');
var router = express.Router();

// Include mongoose and data model for sentence
var mongoose = require('mongoose');
var Sentence = mongoose.model('Sentence');

// set up Gridfs
var mongooseConn = mongoose.connection;
var fs = require('fs');
var Grid = require('gridfs-stream');
// Grid.mongo = mongoose.mongo;
var gfs = Grid(mongooseConn.db, mongoose.mongo);

var streamifier = require('streamifier');
var base64 = require('base64-stream');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//
// Routes here for backend API
// POST /saveSentence
router.post('/sentences', function(request, response, next) {
  // save sentence to mongo here
  var sentence = new Sentence(request.body);
  console.dir(sentence);

  // Call Mongoose's built-in save function for Sentence
  // and pass it a callback to handle error and success cases
  sentence.save(function(error, sentence) {
    if (error) {
      return next(error);
    }

    // If no error, send added sentence back to the client.
    response.json(sentence);
  });
});

// GET /sentences (all)
router.get('/sentences', function(request, response, next) {
  Sentence.find(function(error, sentences) {
    if (error) {
      return next(error);
    }

    // If no error, send retrieved sentences back to client
    response.json(sentences);
  });
});

// Get /sentences/:sentenceId
router.get('/sentences/:sentenceId', function(request, response, next) {

  Sentence.findById(request.params.sentenceId,
    function dbCallback (error, sentence) {
      if (error) {
        return next(error);
      }
      if (!sentence) {
        return next(new Error('can\t find sentence'));
      }

      // We've got a sentence, send it to the client as JSON
      response.json(sentence);
    });
});


router.get('/save', function(request, response, next) {
  // Streaming to GridFS
  // Filename to store in MongoDB
  var writeStream = gfs.createWriteStream({
    filename: 'cherryDb.mp3',
    mode: 'w',
    content_type: 'audio/mpeg'
  });

  fs.createReadStream('cherry.mp3').pipe(writeStream);

  writeStream.on('error', function (err) {
    console.log('error saving ' + file.filename);
    return next(err); // early return on err
    // response.json({error: err});
  });

  writeStream.on('close', function (file) {
    // do something with 'file'
    console.log(file.filename + ' written To DB');
    response.json({filename: file.filename});
  });
});


router.get('/read', function(request, response, next) {
  var readStream = gfs.createReadStream({
    filename: 'cherryDb.mp3'
  });

  // Error handling, e.g. file does not exist
  readStream.on('error', function (err) {
    return next(err);
  });

  readStream.pipe(response);
});





router.post('/saveRecording', function(request, response, next) {
   // dont bother with sentence stuff for right now
  // var sentence = new Sentence();
  // sentence.audio = split[1];
  // sentence.timestamp = request.body.timestamp;
  // sentence.text = request.body.text;

  var split = request.body.audio.split('base64,');
  var base64buff = new Buffer(split[1]);


  var writeStream = gfs.createWriteStream({
    filename: 'file.wav',
    mode: 'w',
    content_type: 'audio/wav'
  });

  streamifier.createReadStream(base64buff).pipe(writeStream);

  // Handlers for the stream that's actually writing to GFS
  writeStream.on('error', function (err) {
    console.log('error saving ' + file.filename);
    return next(err); // early return on err
  });

  writeStream.on('close', function (file) {
    // do something with 'file'
    console.log(file.filename + ' written To DB');
    response.json({filename: file.filename});
  });
});

router.get('/getRecording/:sentenceId', function(request, response, next) {
  var readStream = gfs.createReadStream({
    filename: 'file.wav'
  });

  response.writeHead(200,
    {'Content-Type:': 'audio/wav'}
  );

  // Error handling, e.g. file does not exist
  readStream.on('error', function (err) {
    return next(err);
  });

  readStream.on('end', function (data) {
    response.end();
  });

  readStream.pipe(base64.decode()).pipe(response);
  // response.end();
});




// Should add middleware if we end up using sentenceId a lot


module.exports = router;
