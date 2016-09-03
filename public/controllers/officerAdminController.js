angular.module('smsApp-officerAdminsList', ['ngRoute', 'datatables', 'ngResource', 'ngNotificationsBar', 'ngSanitize'])
    .controller('OfficerAdminListCtrl', function($scope, $location, OfficerAdmin, $uibModal, $routeParams, $rootScope, notifications) {
        OfficerAdmin.all().success(function(response) {
            $scope.officerAdmins = response.officerAdmins;
        });

        $scope.search = function() {
            if ($scope.searchName) {
                OfficerAdmin.searchName($scope.searchName).success(function(response) {
                    $scope.officerAdmins = response.officerAdmins;
                });
            } else if ($scope.searchID) {
                OfficerAdmin.searchID($scope.searchID).success(function(response) {
                    $scope.officerAdmins = response.officerAdmins;
                });
            }
        };

        $scope.officerAdminDetails = function(officerAdminID) {
            $location.path('/officerAdmin/' + officerAdminID);
        };

        $scope.deleteOfficerAdmin = function(id) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/alert/confirm.html',
                controller: function($scope, $uibModalInstance, OfficerAdmin) {

                    $scope.comtent = 'Are you sure you want to delete?'

                    $scope.ok = function() {

                        OfficerAdmin.delete(id)
                            .then(
                                function(response) {
                                    OfficerAdmin.all().success(function(response) {
                                        $scope.officerAdmins = response.officerAdmins;
                                    });

                                    notifications.showSuccess({
                                        message: 'Delete officerAdmin successfully.'
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
                    OfficerAdmin.all().success(function(response) {
                        $scope.officerAdmins = response.officerAdmins;
                    });

                }
            });
        };

        $scope.editOfficerAdmin = function(id) {
            OfficerAdmin.get(id).success(function(res) {
                $rootScope.officerAdmin = res.officerAdmin;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/officerAdmins/new.html',
                    controller: function($scope, $uibModalInstance, OfficerAdmin) {
                        $scope.officerAdminTitle = 'Edit Officer Admin';
                        $scope.birthDate = new Date($rootScope.officerAdmin.birthDate);
                        $scope.email = $rootScope.officerAdmin.email;
                        $scope.firstName = $rootScope.officerAdmin.firstName;
                        $scope.middleName = $rootScope.officerAdmin.middleName;
                        $scope.lastName = $rootScope.officerAdmin.lastName;
                        $scope.gender = $rootScope.officerAdmin.gender;
                        $scope.phoneNumber = $rootScope.officerAdmin.phoneNumber;
                        $scope.addressLine1 = $rootScope.officerAdmin.addressLine1;
                        $scope.city = $rootScope.officerAdmin.city;
                        $scope.state = $rootScope.officerAdmin.state;
                        $scope.zipCode = $rootScope.officerAdmin.zipCode;

                        $scope.officerAdminSubmit = function() {
                            $rootScope.officerAdmin.email = $scope.email;
                            $rootScope.officerAdmin.firstName = $scope.firstName;
                            $rootScope.officerAdmin.middleName = $scope.middleName;
                            $rootScope.officerAdmin.lastName = $scope.lastName;
                            $rootScope.officerAdmin.birthDate = $scope.birthDate;
                            $rootScope.officerAdmin.gender = $scope.gender;
                            $rootScope.officerAdmin.phoneNumber = $scope.phoneNumber;
                            $rootScope.officerAdmin.addressLine1 = $scope.addressLine1;
                            $rootScope.officerAdmin.city = $scope.city;
                            $rootScope.officerAdmin.state = $scope.state;
                            $rootScope.officerAdmin.zipCode = $scope.zipCode;

                            OfficerAdmin.update($rootScope.officerAdmin._id, $rootScope.officerAdmin)
                                .then(
                                    function(response) {
                                        notifications.showSuccess({
                                            message: 'Update officerAdmin successfully.'
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
                        OfficerAdmin.all().success(function(response) {
                            $scope.officerAdmins = response.officerAdmins;
                        });
                    }
                });

            });
        };

        $scope.addOfficerAdmin = function(isOfficerAdmin) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/officerAdmins/new.html',
                controller: function($scope, $uibModalInstance, officerAdmin) {
                    $scope.officerAdminTitle = 'Add Officer Admin';
                    $scope.gender = "M";

                    $scope.officerAdminSubmit = function() {
                        $scope.officerAdmin = {
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

                        $uibModalInstance.close($scope.officerAdmin);
                    }

                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'md',
                resolve: {
                    officerAdmin: function() {
                        return $scope.officerAdmin;
                    }
                },
                backdrop: 'static'
            });

            modalInstance.result.then(function(officerAdmin) {
                OfficerAdmin.insert(officerAdmin)
                    .then(
                        function(response) {
                            notifications.showSuccess({
                                message: 'Add officerAdmin successfully.'
                            });
                            OfficerAdmin.all().success(function(response) {
                                $scope.officerAdmins = response.officerAdmins;
                            });
                        },
                        function(response) {
                            console.log(response);
                        });

            });
        }
        OfficerAdmin.all().success(function(response) {
            $scope.officerAdmins = response.officerAdmins;
        });
      
    })
    .controller('OfficerAdminDetailsCtrl', function($scope, $routeParams, $uibModal, OfficerAdmin, Institution, Ministry, $security, store) {
        OfficerAdmin.get($routeParams.Id).success(function(response) {
            $scope.officerAdmin = response.officerAdmin;
        });


    });