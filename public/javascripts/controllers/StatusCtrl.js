onceUpon.controller('StatusCtrl', function StatusCtrl($scope, SocketFactory) {
  // Tie scoped status vars to SocketFactory
  $scope.userPosition = SocketFactory.userPosition;
  $scope.totalUsers = SocketFactory.totalUsers;
  $scope.remainingTime = SocketFactory.remainingTime;
  $scope.currentMessage = SocketFactory.currentMessage;
  $scope.countingDown = SocketFactory.countingDown;

  // Helper so we can use ng-repeat as a for loop, a feature that
  // already exists in Angular 2, apparently
  $scope.range = function(n) {
    var negArray = [];
    for (var i = (n-1); i >= 0; i--) {
      negArray.push(i);
    }
    return negArray;
  }

  // Helper function to get the appropriate status text for a given index in the
  // recording queue. index is backwards because of the way ng-repeat is set-up
  // to count.
  $scope.getStatusText = function(index) {
    if (index === 0) {
      return 'speaking';
    } else if (index === 1) {
      return 'next';
    } else {
      return 'waiting';
    }
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
  });

  $scope.$watch(function() {
    return SocketFactory.currentMessage;
  }, function(newVal, oldVal) {
    if (!$scope.currentMessage.inProgress && newVal) {
      // this DOM manipulation should probably not be in the controller.
      // but i'm not sure where to put it. maybe we need a scroll directive on
      // the whole panel that handles various different behaviors
      $("#sentences-panel").animate({scrollTop:$("#sentences-panel")[0].scrollHeight}, 1000);
    }

    $scope.currentMessage = newVal;
    console.log(newVal);
  });

  $scope.$watch(function() {
    return SocketFactory.countingDown;
  }, function(newVal, oldVal) {
    $scope.countingDown = newVal;
  });



});
