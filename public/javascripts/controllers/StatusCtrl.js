onceUpon.controller('StatusCtrl', function StatusCtrl($scope) {
  $scope.statusText = "";

  angular.element(document).ready(function() {

    var socket = io();

    socket.on('status', function(msg) {
      $scope.statusText = msg;
      console.log('status from server: ' + msg);
    });


  });
});
