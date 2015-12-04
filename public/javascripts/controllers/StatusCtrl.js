onceUpon.controller('StatusCtrl', function StatusCtrl($scope, SocketFactory) {
  // Tie scoped status vars to SocketFactory
  $scope.userPosition = SocketFactory.userPosition;
  $scope.totalUsers = SocketFactory.totalUsers;
  $scope.remainingTime = SocketFactory.remainingTime;
  $scope.currentMessage = SocketFactory.currentMessage;
  $scope.countingDown = SocketFactory.countingDown;

  $scope.range = function(n) {
    var negArray = [];
    for (var i = (n-1); i >= 0; i--) {
      negArray.push(i);
    }
    return negArray;
  }



  // Really should refactor these... but scope watchgroup was not working...
  $scope.$watch(function() {
    return SocketFactory.userPosition;
  }, function(newVal, oldVal) {
    $scope.userPosition = newVal;
  });

  $scope.$watch(function() {
    return SocketFactory.totalUsers;
  }, function(newVal, oldVal) {
    $scope.totalUsers = newVal;
  });

  $scope.$watch(function() {
    return SocketFactory.remainingTime;
  }, function(newVal, oldVal) {
    $scope.remainingTime = newVal;
    console.log('newVal');
  });

  $scope.$watch(function() {
    return SocketFactory.currentMessage;
  }, function(newVal, oldVal) {
    $scope.currentMessage = newVal;
  });

  $scope.$watch(function() {
    return SocketFactory.countingDown;
  }, function(newVal, oldVal) {
    $scope.countingDown = newVal;
  });



});
