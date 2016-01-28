onceUpon.controller('StatusCtrl', function StatusCtrl($scope, SocketFactory) {
  // expose SocketFactory to controller scope so partial can access it
  $scope.SocketFactory = SocketFactory;

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
      if ((SocketFactory.totalUsers > 1) && (SocketFactory.userPosition === 0)) {
        return "ready..." + SocketFactory.remainingTime;
      } else if ((SocketFactory.totalUsers === 1) && (SocketFactory.userPosition === 0)) {
        return "ready";
      } else {
        return "speaking";
      }
    } else if (index === 1) {
      return "next";
    } else {
      return "queued";
    }
  }
});
