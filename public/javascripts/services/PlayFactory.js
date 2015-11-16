onceUpon.factory('PlayFactory', function PlayFactory(SentencesFactory) {
  var factory = {};

  // Just take sentenceIds from SentencesFactory
  factory.sentenceIds = SentencesFactory.sentences.map(function(sentence) {
    return sentence._id;
  });

  factory.playing = null;
  factory.audioTags = $('audio');
  factory.leftToBind = factory.sentenceIds.length;

  $('audio').on('click', function(e) {
    console.log('clicked 0');
  });



  factory.playFrom = function (element) {
    // Calculate how many more sentences we have to play
    var thisId = element.context.lastElementChild.id;
    var thisIndex = factory.sentenceIds.indexOf(thisId);

    // start at this sentence, let it cascade down
    $('audio#' + factory.sentenceIds[thisIndex])[0].play();

    $('audio#' + factory.sentenceIds[thisIndex]).on('hover', function() {
      console.log('clicked 0');
    });

  }

  factory.initBindings = function () {
    // recursive attempt
    // console.log('i am initing bindings');
    // var makeBinding = function(index) {
    //   factory.leftToBind--;
    //   if (!factory.leftToBind) {
    //     console.log('not left to bind');
    //     return;
    //   } else {
    //     console.log(factory.leftToBind + ' left to bind');
    //     // When this sentence ends, play the next one
    //     $('audio#' + factory.sentenceIds[index]).bind('ended', function() {
    //       $('audio#' + factory.sentenceIds[index+1])[0].play();
    //       makeBinding(index+1);
    //       console.log('factory.leftToBind: ' + factory.leftToBind);
    //     });
    //   }
    // }

    $('audio#' + factory.sentenceIds[0]).bind('click', function(e) {
      console.log('clicked 0');
    });


    // If we have sentences, set up play bindings
    // if (factory.sentenceIds) {
    //   for (var i = 0; i < factory.sentenceIds.length; i++) {
    //     console.dir($('audio#' + factory.sentenceIds[i]));
    //     $('audio#' + factory.sentenceIds[i]).bind('ended', function(e) {
    //       console.log(i + ' ended');
    //       $('audio#' + factory.sentenceIds[i+1])[0].play();
    //
    //     });
    //     console.log('bound ' + i + ' to play ' + (i+1) + ' onend');
    //   }
    // }
    //
    // //trying same thing outside of for loop
    $('audio#' + factory.sentenceIds[0]).bind('ended', function(e) {
      console.log(0 + ' ended');
      $('audio#' + factory.sentenceIds[1])[0].play();

    });



    // If we have sentences, cascade down and make all onEnded bindings here
    // starting at index 0 and going until
    // if (factory.sentenceIds) {
    //   makeBinding(0);
    // }
  }

  factory.initBindings();



  return factory;
});
