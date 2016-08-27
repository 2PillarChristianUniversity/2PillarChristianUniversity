angular.module('smsApp-financialsList', ['ngRoute', 'datatables', 'ngResource', 'ngNotificationsBar', 'ngSanitize'])
  .controller('FinancialListCtrl', function ($scope, $location, Financial, $uibModal, $routeParams, $rootScope, notifications, Student, Semester) {
    Financial.all().success(function(response) {
        $scope.financials = response.financials;
    });

    Semester.all().success(function(response) {
        $scope.semesters = response.semesters;
    });

    // search financial
    $scope.search = function() {
        if ($scope.searchName) {
            Financial.searchName($scope.searchName).success(function(response) {
                $scope.financials = response.financials;
            });
        } else if ($scope.searchID) {
            Financial.searchID($scope.searchID).success(function(response) {
                $scope.financials = response.financials;
            });
        }
    };

    // edit Financials
    $scope.editFinancial = function(id) {
            Financial.get(id).success(function(res) {
                $rootScope.financial = res.financial;
                console.log($rootScope.financial);
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/students/financial.html',
                    controller: function($scope, $uibModalInstance, Financial) {
                        $scope.financialTitle = 'Edit Financial';
                        $scope.studentID = $rootScope.financial.studentID;
                        // $scope.studentEmail = $rootScope.financial.F_Students[0].email;
                        $scope.semester = $rootScope.financial._id;
                        $scope.monthlyPayment = $rootScope.financial.monthlyPayment;
                        $scope.comment = $rootScope.financial.comment;

                        $scope.financialSubmit = function() {
                            

                            Financial.update($rootScope.financial._id, $rootScope.financial)
                                .then(
                                    function(response) {
                                        notifications.showSuccess({
                                            message: 'Update financial successfully.'
                                        });
                                        $uibModalInstance.close(true);
                                    },
                                    function(response) {
                                        console.log(response);
                                    }
                                );

                        };

                        $scope.cancel = function() {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    size: 'md',
                    resolve: {
                        isfinished: function() {
                            return true;
                        }
                    }
                });

                modalInstance.result.then(function(isfinished) {
                    if (isfinished === true) {
                        Financial.all().success(function(response) {
                            $scope.financials = response.financials;
                        });
                    }
                });

            });
        };



   })

  .controller('FinancialDetailsCtrl', function ($scope, $routeParams, $uibModal, Institution) {
    Financial.get($routeParams.Id).success(function (response) {
      $scope.financial = response.financial;
    });
  });

