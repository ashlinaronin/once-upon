var express = require('express');
var router = express.Router();

// Include mongoose and data model for sentence
var mongoose = require('mongoose');
var Sentence = mongoose.model('Sentence');

// set up Gridfs
var mongooseConn = mongoose.connection;
var fs = require('fs');
var Grid = require('gridfs-stream');
var gfs = Grid(mongooseConn.db, mongoose.mongo);

// Some utilities to format and encode/decode streams
var streamifier = require('streamifier');
var base64 = require('base64-stream');

var PubSub = require('pubsub-js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Routes here for backend API
// POST /saveSentence
router.post('/sentences', function(request, response, next) {
  // save sentence to mongo here
  var sentence = new Sentence(request.body);

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

// GET any sentences posted between timestamp and now
// $gt = greater than
// $lt = less than
router.get('/sentences/new/:timestamp', function(request, response, next) {
  if (!request.params.timestamp) {
    return next('No timestamp in new sentence GET request');
  }

  Sentence.find({
    'timestamp': {
      '$gt': request.params.timestamp,
      '$lt': new Date()
    }
  },
  function dbCallback (error, sentences) {
    if (error) {
      return next(error);
    }

    // If no error, send back sentences
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

// POST /saveRecording
router.post('/saveRecording', function(request, response, next) {
   // dont bother with sentence stuff for right now
  var sentence = new Sentence();
  sentence.timestamp = request.body.timestamp;
  sentence.text = request.body.text;

  sentence.save(function(error, sentence) {
    if (error) {
      return next(error);
    }

    // If no error, write the file to the DB with name corresponding to ID
    // 1. Take off prefixing info in dataURL to get just data
    // 2. Don't encode it to base64 because it's already encoded in base64
    // Default will be utf8, which should work to hold the already-base64 encoded
    var split = request.body.audio.split('base64,');
    var base64string = new Buffer(split[1]);

    var writeStream = gfs.createWriteStream({
      filename: sentence._id + '.mp3',
      mode: 'w',
      content_type: 'audio/mp3'
    });

    // Make a stream out of the base64 string and pipe it to gridFS stream
    streamifier.createReadStream(base64string).pipe(writeStream);

    // Handlers for the stream that's actually writing to GFS
    writeStream.on('error', function (err) {
      console.log('Error saving ' + file.filename);
      return next(err); // early return on err
    });

    writeStream.on('close', function (file) {
      // do something with 'file'
      console.log(file.filename + ' written To DB');
      response.json({filename: file.filename});

      // try waiting a second after file is uploaded to send the message? hacky
      PubSub.publish('AUDIO_FILE_UPLOADED');
      // setTimeout(function() {
      //   PubSub.publish('AUDIO_FILE_UPLOADED');
      // }, 1000);

    });

  }); // end sentence.save


}); // end POST /saveRecording

// GET /getRecording/:sentenceId
router.get('/getRecording/:sentenceId', function(request, response, next) {

  // Write headers so that the browser knows it's an audio file
  response.writeHead(200,
    {'Content-Type': 'audio/mp3',
    'Content-Disposition': 'attachment; filename="' +
      request.params.sentenceId  + '.mp3"'}
  );

  // Get this particular file from GridFS
  var readStream = gfs.createReadStream({
    filename: request.params.sentenceId + '.mp3'
  });

  // Error handling, e.g. file does not exist
  readStream.on('error', function (err) {
    return next(err);
  });

  // End the response when the stream of data is done
  readStream.on('end', function (data) {
    response.end();
  });

  // Decode the base64 stream and pipe it to the response
  readStream.pipe(base64.decode()).pipe(response);
});




// TODO: Should add middleware if we end up using sentenceId a lot

module.exports = router;
