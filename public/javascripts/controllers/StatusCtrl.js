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
    // if (index === 0) {
    //   if (($scope.totalUsers > 1) && ($scope.userPosition === 0)) {
    //     return "your turn, " + $scope.remainingTime + "s left";
    //   } else {
    //     return "speaking";
    //   }
    // } else if (index === 1) {
    //   if ($scope.userPosition === 1) {
    //     return "you're next";
    //   } else {
    //     return "next";
    //   }
    // } else {
    //   if ($scope.userPosition === index) {
    //     return "you're queued";
    //   } else {
    //     return "queued";
    //   }
    //
    // }

    if (index === 0) {
      if (($scope.totalUsers > 1) && ($scope.userPosition === 0)) {
        return $scope.remainingTime + "s left";
      } else {
        return "speaking";
      }
    } else if (index === 1) {
      return "next";
    } else {
      return "queued";
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

  // Trying to simplify all of these watch statements.
  // This works but it will actually update the values of all the watched
  // variables when any single one of them changes, which isn't what we want.
  // $scope.$watchGroup([
  //   function() {return SocketFactory.userPosition },
  //   function() { return SocketFactory.totalUsers }
  // ], function (newVals, oldVals) {
  //   $scope.userPosition = newVals[0];
  //   $scope.totalUsers = newVals[1];
  // });

  $scope.$watch(function() {
    return SocketFactory.remainingTime;
  }, function(newVal, oldVal) {
    $scope.remainingTime = newVal;
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
