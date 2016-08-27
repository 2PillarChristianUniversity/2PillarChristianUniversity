angular.module('smsApp-financialsList', ['ngRoute', 'datatables', 'ngResource', 'ngNotificationsBar', 'ngSanitize'])
    .controller('FinancialListCtrl', function($scope, $location, Financial, $uibModal, $routeParams, $rootScope,
        notifications, Student, Semester) {

        Financial.all().success(function(response) {
            $scope.financials = response.financials;
        });

        Semester.all().success(function(response) {
            $scope.semesters = response.semesters;
            $rootScope.semester = $scope.semesters
        });

        // edit Financials
        $scope.editFinancial = function(id) {
            Financial.get(id).success(function(res) {
                $rootScope.financial = res.financial[0];
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/students/financial.html',
                    controller: function($scope, $uibModalInstance, Financial) {
                        
                        $scope.financialTitle = 'Edit Financial';
                        $scope.studentID = $rootScope.financial.Students[0]._id
                        $scope.studentEmail = $rootScope.financial.Students[0].email
                        $scope.semester = $rootScope.financial.Semesters[0]._id;
                        $scope.monthlyPayment = $rootScope.financial.monthlyPayment;
                        $scope.comment = $rootScope.financial.comment;
                        $scope.semesters = $rootScope.semester;

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

.controller('FinancialDetailsCtrl', function($scope, $routeParams, $uibModal, Institution) {
    Financial.get($routeParams.Id).success(function(response) {
        $scope.financial = response.financial;
    });
});