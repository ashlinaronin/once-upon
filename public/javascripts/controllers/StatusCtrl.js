onceUpon.controller('StatusCtrl', function StatusCtrl($scope) {
  $scope.statusTxt = "";

  angular.element(document).ready(function() {

    var socket = io();

    socket.on('status', function(msg) {
      $scope.statusTxt = msg;
      console.log('status from server: ' + msg);

      // Every custom event handler needs to apply its scope
      $scope.$apply();
    });


  });
});
