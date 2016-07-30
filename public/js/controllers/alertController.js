angular.module('smsApp-studentsList', ['ngRoute'])
  .controller('alertCtrl', function ($scope) {

  $scope.addAlert = function() {
    $scope.alerts.push({msg: 'Another alert!'});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  })