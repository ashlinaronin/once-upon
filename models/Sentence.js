var mongoose = require('mongoose');

var SentenceSchema = new mongoose.Schema({
  text: String,
  timestamp: Date
});

mongoose.model('Sentence', SentenceSchema);
