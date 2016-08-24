angular.module('smsApp-financialsList', ['ngRoute', 'datatables', 'ngResource', 'ngNotificationsBar', 'ngSanitize'])
  .controller('FinancialListCtrl', function ($scope, $location, Financial, $uibModal, $routeParams, $rootScope, notifications, Student) {
   Student.all().success(function (response) {
			$scope.students = response.students;
		});
   $scope.financials = [];
   $scope.financials = $scope.students.financials;

	})

  .controller('FinancialDetailsCtrl', function ($scope, $routeParams, $uibModal, Institution) {
    Financial.get($routeParams.Id).success(function (response) {
      $scope.financial = response.financial;
    });
  });

