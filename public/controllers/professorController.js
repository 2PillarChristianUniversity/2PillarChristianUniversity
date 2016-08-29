angular.module('smsApp-professorsList', ['ngRoute', 'datatables', 'ngResource', 'ngNotificationsBar', 'ngSanitize'])
    .controller('ProfessorListCtrl', function($scope, $location, Professor, $uibModal, $routeParams, $rootScope, notifications) {
        Professor.all().success(function(response) {
            $scope.professors = response.professors;
        });

        $scope.search = function() {
            if ($scope.searchName) {
                Professor.searchName($scope.searchName).success(function(response) {
                    $scope.professors = response.professors;
                });
            } else if ($scope.searchID) {
                Professor.searchID($scope.searchID).success(function(response) {
                    $scope.professors = response.professors;
                });
            }
        };

        $scope.professorDetails = function(professorID) {
            $location.path('/professor/' + professorID);
        };

        $scope.deleteProfessor = function(id) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/alert/confirm.html',
                controller: function($scope, $uibModalInstance, Professor) {

                    $scope.comtent = 'Are you sure you want to delete?'

                    $scope.ok = function() {

                        Professor.delete(id)
                            .then(
                                function(response) {
                                    Professor.all().success(function(response) {
                                        $scope.professors = response.professors;
                                    });

                                    notifications.showSuccess({
                                        message: 'Delete professor successfully.'
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
                    Professor.all().success(function(response) {
                        $scope.professors = response.professors;
                    });

                }
            });
        };

        $scope.editProfessor = function(id) {
            Professor.get(id).success(function(res) {
                $rootScope.professor = res.professor;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/professors/new.html',
                    controller: function($scope, $uibModalInstance, Professor) {
                        $scope.professorTitle = 'Edit Professor';
                        $scope.birthDate = new Date($rootScope.professor.birthDate);
                        $scope.email = $rootScope.professor.email;
                        $scope.firstName = $rootScope.professor.firstName;
                        $scope.middleName = $rootScope.professor.middleName;
                        $scope.lastName = $rootScope.professor.lastName;
                        $scope.gender = $rootScope.professor.gender;
                        $scope.phoneNumber = $rootScope.professor.phoneNumber;
                        $scope.addressLine1 = $rootScope.professor.addressLine1;
                        $scope.city = $rootScope.professor.city;
                        $scope.state = $rootScope.professor.state;
                        $scope.zipCode = $rootScope.professor.zipCode;

                        $scope.professorSubmit = function() {
                            $rootScope.professor.email = $scope.email;
                            $rootScope.professor.firstName = $scope.firstName;
                            $rootScope.professor.middleName = $scope.middleName;
                            $rootScope.professor.lastName = $scope.lastName;
                            $rootScope.professor.birthDate = $scope.birthDate;
                            $rootScope.professor.gender = $scope.gender;
                            $rootScope.professor.phoneNumber = $scope.phoneNumber;
                            $rootScope.professor.addressLine1 = $scope.addressLine1;
                            $rootScope.professor.city = $scope.city;
                            $rootScope.professor.state = $scope.state;
                            $rootScope.professor.zipCode = $scope.zipCode;

                            Professor.update($rootScope.professor._id, $rootScope.professor)
                                .then(
                                    function(response) {
                                        notifications.showSuccess({
                                            message: 'Update professor successfully.'
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
                        Professor.all().success(function(response) {
                            $scope.professors = response.professors;
                        });
                    }
                });

            });
        };

        $scope.addProfessor = function(isProfessor) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/professors/new.html',
                controller: function($scope, $uibModalInstance, professor) {
                    $scope.professorTitle = 'Add Professor';
                    $scope.gender = "M";

                    $scope.professorSubmit = function() {
                        $scope.professor = {
                            _id: $scope._id,
                            email: $scope.email,
                            firstName: $scope.firstName,
                            middleName: $scope.middleName,
                            lastName: $scope.lastName,
                            birthDate: $scope.birthDate,
                            gender: $scope.gender,
                            phoneNumber: $scope.phoneNumber,
                            addressLine1: $scope.addressLine1,
                            city: $scope.city,
                            state: $scope.state,
                            zipCode: $scope.zipCode
                        };

                        $uibModalInstance.close($scope.professor);
                    }

                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'md',
                resolve: {
                    professor: function() {
                        return $scope.professor;
                    }
                }
            });

            modalInstance.result.then(function(professor) {
                Professor.insert(professor)
                    .then(
                        function(response) {
                            notifications.showSuccess({
                                message: 'Add professor successfully.'
                            });
                            Professor.all().success(function(response) {
                                $scope.professors = response.professors;
                            });
                        },
                        function(response) {
                            console.log(response);
                        });

            });
        }

    })
    .controller('ProfessorDetailsCtrl', function($scope, $routeParams, $uibModal, Professor, Institution, Ministry, $security, store) {
        Professor.get($routeParams.Id).success(function(response) {
            $scope.professor = response.professor;
        });

        // permission professor
        $scope.professorPermission = store.get('professorID');
        Professor.get($scope.professorPermission).success(function(response) {
            $scope.professor = response.professor;
        });

    });