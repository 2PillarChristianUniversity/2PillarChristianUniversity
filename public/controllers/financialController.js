angular.module('smsApp-financialsList', ['ngRoute', 'datatables', 'ngResource', 'ngNotificationsBar', 'ngSanitize', 'ngSecurity'])
    .controller('FinancialListCtrl', function($scope, $location, $security, Financial, $uibModal, $routeParams, $rootScope,
        notifications, Student, Semester) {
        if (!$security.hasPermission('Admin')) {
            $location.path('/404_page/');
        }
        Financial.all().success(function(response) {
            $scope.financials = response.financials;
        });

        Semester.all().success(function(response) {
            $scope.semesters = response.semesters;
            $rootScope.semester = $scope.semesters
        });

        // edit financials
        $scope.editFinancial = function(id) {
            Financial.get(id).success(function(res) {
                $rootScope.financial = res.financial[0];
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/financials/edit.html',
                    controller: function($scope, $uibModalInstance, Financial) {

                        $scope.financialTitle = 'Edit Financial';
                        $scope.studentID = $rootScope.financial.Students[0]._id
                        $scope.studentEmail = $rootScope.financial.Students[0].email
                        $scope.semester = $rootScope.financial.Semesters[0]._id;
                        $scope.monthlyPayment = $rootScope.financial.monthlyPayment;
                        $scope.comment = $rootScope.financial.comment;
                        $scope.semesters = $rootScope.semester;
                        $scope.studentComment = $rootScope.financial.studentComment;
                        $scope.adminComment = $rootScope.financial.adminComment;
                        $scope.status = $rootScope.financial.status;

                        $scope.financialSubmit = function() {
                            $scope.financial = {
                                "studentID": $scope.studentID,
                                "semester": $scope.semester,
                                "monthlyPayment": $scope.monthlyPayment,
                                "status": $scope.status,
                                "studentComment": $scope.studentComment,
                                "adminComment": $scope.adminComment
                            };

                            Financial.update($rootScope.financial._id, $scope.financial)
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
                    },
                    backdrop: 'static'
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

        // delete financials
        $scope.deleteFinancial = function(id) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/alert/confirm.html',
                controller: function($scope, $uibModalInstance, Financial) {

                    $scope.comtent = 'Are you sure you want to delete?'

                    $scope.ok = function() {

                        Financial.delete(id)
                            .then(
                                function(response) {
                                    Financial.all().success(function(response) {
                                        $scope.financials = response.financials;
                                    });

                                    notifications.showSuccess({
                                        message: 'Delete financial successfully.'
                                    });
                                    $uibModalInstance.close(true);
                                },
                                function(response) {
                                    notifications.showError({
                                        message: response.error
                                    });
                                });
                    }

                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };

                },
                size: 'sm',
                resolve: {
                    isfinished: function() {
                        return true
                    }
                }
            });

            modalInstance.result.then(function(result) {
                if (result == true) {
                    Financial.all().success(function(response) {
                        $scope.financials = response.financials;
                    });

                }
            });
        };



    })

.controller('FinancialDetailsCtrl', function($scope, $routeParams, $uibModal, Institution) {
    Financial.get($routeParams.Id).success(function(response) {
        $scope.financial = response.financial;
    });
});