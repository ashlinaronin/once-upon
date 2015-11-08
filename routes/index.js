var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// Routes here for backend API
// POST /saveSentence
router.post('/saveSentence', function(req, res, next) {
  // save sentence to mongo here
});

// GET /getSentences/[startingIndex]

//





module.exports = router;
