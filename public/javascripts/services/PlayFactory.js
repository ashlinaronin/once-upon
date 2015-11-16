onceUpon.factory('PlayFactory', function PlayFactory(SentencesFactory) {
  var factory = {};

  // Just take sentenceIds from SentencesFactory
  factory.sentenceIds = SentencesFactory.sentences.map(function(sentence) {
    return sentence._id;
  });

  factory.playing = null;
  factory.leftToPlay = [];

  factory.playFrom = function (element) {
    var thisId = element.context.lastElementChild.id;
    console.log('play from this id: ' + thisId);

    var location = factory.sentenceIds.indexOf(thisId);
    console.log('location in factory.sentenceIds: ' + location);




/*
    console.dir($('#' + factory.sentenceIds[0])[0]);
    $('#' + factory.sentenceIds[3])[0].play(); */



      // $('audio#' + sentence._id).bind('ended', function() {
      //   console.log(sentence._id + ' finished playing');
      // });
    // });
  }



  return factory;
});
