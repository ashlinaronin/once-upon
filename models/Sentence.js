var mongoose = require('mongoose');

// Define a new Mongoose Schema for Sentences.
var SentenceSchema = new mongoose.Schema({
  index: Number,
  text: String,
  audio: Buffer,
  timestamp: Date,
  user: {
    ip: Number,
    location: String
  }
});


mongoose.model('Sentence', SentenceSchema);

// Don't need any custom methods yet
// SentenceSchema.methods
