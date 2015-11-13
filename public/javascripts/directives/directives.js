onceUpon.directive('onceGetAudio', function() {
  /* This directive is restricted to matching by attribute name
  ** because of the use case: <audio once-get-audio>.
  ** From the Angular docs: 'Use an attribute when you are
  ** decorating an existing element with new functionality.'
  */

  return {
    restrict: 'A',
    scope: {
      onceGetAudio: '='
    }
  }
});
