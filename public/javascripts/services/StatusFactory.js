onceUpon.factory('StatusFactory', function StatusFactory($rootScope) {
  var factory = {};
  factory.userStatus = null;

  // When the page has loaded, fire up Socket.io client and listen for
  // status messages
  angular.element(document).ready(function() {
    var socket = io();

    socket.on('status', function(msg) {
      console.log('status from server: ' + msg);

      // Every custom event handler needs to apply its scope
      // Syntax is a bit different in service
      $rootScope.$apply(function() {
        factory.userStatus = msg;
      });
    });
  });

  return factory;
});
