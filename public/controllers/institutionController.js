angular.module('smsApp-institutionsList', ['ngRoute', 'datatables', 'ngResource', 'ngNotificationsBar', 'ngSanitize'])
  .controller('InstitutionListCtrl', function ($scope, $location, Institution, $uibModal, $routeParams, $rootScope, notifications) {
   Institution.all().success(function (response) {
			$scope.institutions = response.institutions;
		});

    $scope.search = function () {
			if ($scope.searchName) {
				Institution.searchName($scope.searchName).success(function (response) {
					$scope.institutions = response.institutions;
				});
			}
			else if ($scope.searchID) {
				Institution.searchID($scope.searchID).success(function (response) {
					$scope.institutions = response.institutions;
				});
			}
	};

	$scope.institutionDetails = function (institutionID) {
		$location.path('/institution/' + institutionID);
	};

  // delete institution
	$scope.institutionDelete = function(id) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/alert/confirm.html',
                controller: function($scope, $uibModalInstance, Institution) {

                    $scope.comtent = 'Are you sure you want to delete?'

                    $scope.ok = function() {

                        Institution.delete(id)
                            .then(
                                function(response) {
                                    Institution.all().success(function(response) {
                                        $scope.institutions = response.institutions;
                                    });

                                    notifications.showSuccess({
                                        message: 'Successfully.'
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
                    Institution.all().success(function(response) {
                        $scope.institutions = response.institutions;
                    });

                }
            });
  };

  $scope.editInstitution = function(id) {
            Institution.get(id).success(function(res) {
                $rootScope.institution = res.institution;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/institutions/new.html',
                    controller: function($scope, $uibModalInstance, Institution) {
                        $scope.institutionTitle = 'Edit Institution';
                        $scope.name = $rootScope.institution.name;
                        $scope.phoneNumber = $rootScope.institution.phoneNumber;
                        $scope.addressLine1 = $rootScope.institution.addressLine1;
                        $scope.city = $rootScope.institution.city;
                        $scope.state = $rootScope.institution.state;
                        $scope.zipCode = $rootScope.institution.zipCode;

                        $scope.institutionSubmit = function() {
                            $rootScope.institution.name = $scope.name;
                            $rootScope.institution.phoneNumber = $scope.phoneNumber;
                            $rootScope.institution.addressLine1 = $scope.addressLine1;
                            $rootScope.institution.city = $scope.city;
                            $rootScope.institution.state = $scope.state;
                            $rootScope.institution.zipCode = $scope.zipCode;

                            Institution.update($rootScope.institution._id, $rootScope.institution)
                                .then(
                                    function(response) {
                                        notifications.showSuccess({
                                            message: 'successfully.'
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
                        Institution.all().success(function(response) {
                            $scope.institutions = response.institutions;
                        });
                    }
                });

            });
  }; 

  // add institution
  $scope.addInstitutions = function (isInstitution) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'templates/institutions/new.html',
          controller: function ($scope, $uibModalInstance, institution) {
            $scope.institutionTitle = 'Add Institution';         

            $scope.institutionSubmit = function () {
              $scope.institution = {
                  name: $scope.name,
                  phoneNumber: $scope.phoneNumber,
                  addressLine1: $scope.addressLine1,
                  city: $scope.city,
                  state: $scope.state,
                  zipCode: $scope.zipCode
                };
              
              $uibModalInstance.close($scope.institution);
            }

            $scope.cancel = function () {
              $uibModalInstance.dismiss('cancel');
            };
          },
          size: 'md',
          resolve: {
            institution: function () {
              return $scope.institution;
            }
          }
        });

        modalInstance.result.then(function (institution) {
            Institution.insert(institution)
            .then(
            function (response) {
              notifications.showSuccess({
                message: 'Add institution successfully.'});
                Institution.all().success(function (response) {
                $scope.institutions = response.institutions;     
              });                   
            },
            function (response) {
              console.log(response);
            });

        });
  }

	})

  .controller('InstitutionDetailsCtrl', function ($scope, $routeParams, $uibModal, Institution) {
    Institution.get($routeParams.Id).success(function (response) {
      $scope.institution = response.institution;
    });
  });

