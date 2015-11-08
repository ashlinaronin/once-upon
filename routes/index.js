var express = require('express');
var router = express.Router();

// Include mongoose and data model for sentence
var mongoose = require('mongoose');
var Sentence = mongoose.model('Sentence');

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

// GET /getSentences/[startingIndex]
router.get('/sentences', function(request, response, next) {
  Sentence.find(function(error, sentences) {
    if (error) {
      return next(error);
    }

    // If no error, send retrieved sentences back to client
    response.json(sentences);
  });
});



module.exports = router;
