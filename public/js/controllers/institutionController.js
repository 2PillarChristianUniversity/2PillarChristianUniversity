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

	$scope.institutionDelete = function (institutionID) {
			Institution.delete(institutionID)
			.then(
            function (response) {
            	notifications.showSuccess({
                message: 'Delete institution successfully.'});
              	Institution.all().success(function (response) {
                $scope.institutions = response.institutions;     
              });              
            },
            function (response) {
              console.log(response);
            });
	};
    $scope.addInstitutions = function() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/institutions/new.html',
        controller: function($scope, $uibModalInstance, Institution) {
          $scope.institutionTitle = 'Add Institution';

          $scope.institutionSubmit = function() {
            $scope.institution = {
                  name: $scope.name,
                  address: $scope.address,
                  city: $scope.city,
                  country: $scope.country,
                  description: $scope.description
            };

            Institution.insert($scope.institution)
              .then(
                function(response) {
                  notifications.showSuccess({
                    message: 'Add student successfully.'
                  });
                  $uibModalInstance.close();
                  Institution.all().success(function (response) {
                    $scope.institution = response.institution;     
                  });
                },
                function(response) {
                  alert(response.data.error);
                });

          };

          $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
          };
        },
        size: 'md'
      });

    }
	})

  .controller('InstitutionDetailsCtrl', function ($scope, $routeParams, $uibModal, Institution) {
    Institution.get($routeParams.Id).success(function (response) {
      $scope.institution = response.institution;
    });
  });

