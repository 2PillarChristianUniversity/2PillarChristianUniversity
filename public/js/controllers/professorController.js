angular.module('smsApp-professorsList', ['ngRoute', 'datatables', 'ngResource'])
  .controller('ProfessorListCtrl', function ($scope, $location, Professor, $uibModal, $routeParams, $rootScope, notifications) {
   Professor.all().success(function (response) {
			$scope.professors = response.professors;
		});

    $scope.search = function () {
			if ($scope.searchName) {
				Professor.searchName($scope.searchName).success(function (response) {
					$scope.professors = response.professors;
				});
			}
			else if ($scope.searchID) {
				Professor.searchID($scope.searchID).success(function (response) {
					$scope.professors = response.professors;
				});
			}
	};

	$scope.professorDetails = function (professorID) {
		$location.path('/professor/' + professorID);
	};

	$scope.professorDelete = function (professorID) {
			Professor.delete(professorID)
			.then(
            function (response) {
            	notifications.showSuccess({
                message: 'Delete professor successfully.'});
              	Professor.all().success(function (response) {
                $scope.professors = response.professors;     
              });              
            },
            function (response) {
              console.log(response);
            });
	};

	// $scope.professorEdit = function (professorID) {
 //      	Professor.get(professorID).success(function(response){
 //      		$rootScope.professor = response.professor;
 //      	})

 //      	var modalInstance = $uibModal.open({
 //          animation: true,
 //          templateUrl: 'templates/professors/editProfessor.html',
 //          controller: function ($scope, $uibModalInstance, professor) {
          	          	
	// 		console.log($rootScope.professor);
 //            $scope.ok = function () {
 //              $scope.professor = {
 //                  // "_id": $scope._id,
 //                  "email": $scope.email,
 //                  "firstName": $scope.firstName,
 //                  "middleName": $scope.middleName,
 //                  "lastName": $scope.lastName,
 //                  "birthDate": $scope.birthDate,
 //                  "gender": $scope.gender,
 //                  "phoneNumber": $scope.phoneNumber,
 //                  "addressLine1": $scope.addressLine1,
 //                  "city": $scope.city,
 //                  "state": $scope.state,
 //                  "zipCode": $scope.zipCode
 //                };
              
 //              $uibModalInstance.close($scope.professor);
 //            }

 //            $scope.cancel = function () {
 //              $uibModalInstance.dismiss('cancel');
 //            };
 //          },
 //          size: 'md',
 //          resolve: {
 //            professor: function () {
 //              return $scope.professor;
 //            }
 //          }
 //        });

 //        modalInstance.result.then(function (professor) {
 //            Professor.edit($rootScope.professor._id , professor)
 //            .then(
 //            function (response) {
 //              Professor.all().success(function (response) {
 //                $scope.professors = response.professors;     
 //              });              
 //            },
 //            function (response) {
 //              console.log(response);
 //            });

 //        });
 //    };
		
	$scope.addProfessor = function (isProfessor) {
      	var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'templates/professors/new.html',
          controller: function ($scope, $uibModalInstance, professor) {
          	$scope.gender = "M";          	

            $scope.ok = function () {
              $scope.professor = {
                  "_id": $scope._id,
                  "email": $scope.email,
                  "firstName": $scope.firstName,
                  "middleName": $scope.middleName,
                  "lastName": $scope.lastName,
                  "birthDate": $scope.birthDate,
                  "gender": $scope.gender,
                  "phoneNumber": $scope.phoneNumber,
                  "addressLine1": $scope.addressLine1,
                  "city": $scope.city,
                  "state": $scope.state,
                  "zipCode": $scope.zipCode
                };
              
              $uibModalInstance.close($scope.professor);
            }

            $scope.cancel = function () {
              $uibModalInstance.dismiss('cancel');
            };
          },
          size: 'md',
          resolve: {
            professor: function () {
              return $scope.professor;
            }
          }
        });

        modalInstance.result.then(function (professor) {
            Professor.insert(professor)
            .then(
            function (response) {
            	notifications.showSuccess({
                message: 'Add professor successfully.'});
                Professor.all().success(function (response) {
                $scope.professors = response.professors;     
              });                   
            },
            function (response) {
              console.log(response);
            });

        });
    }

	})
	.controller('ProfessorDetailsCtrl', function ($scope, $routeParams, $uibModal, Professor, Institution, Ministry) {
		Professor.get($routeParams.Id).success(function (response) {
			$scope.professor = response.professor;
		});
	})
	.controller('AddProfessorsCtrl', function ($scope, $routeParams, $location, $uibModal, Professor, Institution, Ministry) {
		
		$scope.professor = {
			// _id: "",
			// email: "",
			// firstName: "",
			// middleName: "",
			// lastName: "",
			// birthDate: "",
			gender: "M",
			// phoneNumber: "",
			// addressLine1: "",
			// city: "",
			// state: "",
			// zipCode: "",
		};

		$scope.addProfessor = function (professorID) {
			 Professor.insert($scope.professor)
					.then(
					function (response) {						
						alert("Insert professor success...");
						$location.path('/professor/' + professorID);
					},
					function (response) {
						alert("Can't insert professor...");
						var modalInstance = $uibModal.open({
						animation: true,
						title: 'Efor',
						templateUrl: 'templates/alert/warning.html',
						controller: function ($scope, $uibModalInstance) {
								$scope.errorTitle = 'ERROR';
								$scope.errorContent = "Can't insert professor...";
								$scope.ok = function () {
									$uibModalInstance.dismiss();
								}

							},
							size: 'sm'
						});
					}
					);
		}
	 
	
	});
