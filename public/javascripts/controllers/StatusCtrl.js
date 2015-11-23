onceUpon.controller('StatusCtrl', function StatusCtrl($scope, SocketFactory) {
  $scope.userStatus = SocketFactory.userStatus;

  $scope.currentMessage = SocketFactory.currentMessage;

  $scope.statusColor = 'red';

  // Watch for changes to userStatus in StatusFactory service
  // Convoluted syntax is safer
  // We need both to watch scope here and apply it in service
  $scope.$watch(function() {
    return SocketFactory.userStatus;
  }, function(newValue, oldValue) {
    $scope.userStatus = newValue;

    // Color updating can be refactored, maybe into directive
    if ($scope.userStatus === 'active') {
      $scope.statusColor = 'active';
    } else {
      $scope.statusColor = 'waiting';
    }
  });

});
