angular.module('smsApp-financialsList', ['ngRoute', 'datatables', 'ngResource', 'ngNotificationsBar', 'ngSanitize'])
  .controller('FinancialListCtrl', function ($scope, $location, Financial, $uibModal, $routeParams, $rootScope, notifications, Student, Semester) {
    Financial.all().success(function(response) {
        $scope.financials = response.financials;
    });

    Semester.all().success(function(response) {
        $scope.semesters = response.semesters;
    });

    $rootScope.index = -1;

    // search financial
    $scope.search = function() {
            if ($scope.searchName) {
              for (var i = 0; i < $scope.financials.length; i++) {
                    if ($scope.financials[i].studentID == $scope.searchName) {
                        $scope.request = $scope.financials[i];
                        Financial.searchName($rootScope.index).success(function(response) {
                            $scope.financials = response.financials;
                        });
                    }
                }

                
            } else if ($scope.searchID) {
                for (var i = 0; i < $scope.financials.length; i++) {
                    if ($scope.financials[i].studentID == $scope.searchID) {
                        $scope.request = $scope.financials[i];                                                
                    }
                }
                console.log($scope.request._id); 
                Financial.searchID($scope.request._id).success(function(response) {
                    $scope.financials = response.financials;
                });               
            }
        };

   })

  .controller('FinancialDetailsCtrl', function ($scope, $routeParams, $uibModal, Institution) {
    Financial.get($routeParams.Id).success(function (response) {
      $scope.financial = response.financial;
    });
  });

