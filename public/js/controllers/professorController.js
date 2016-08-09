angular.module('smsApp-professorsList', ['ngRoute', 'datatables', 'ngResource'])
  .controller('ProfessorListCtrl', function ($scope, $location, Professor, $uibModal, $routeParams) {
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
              Professor.all().success(function (response) {
                $scope.professors = response.professors;     
              });              
            },
            function (response) {
              console.log(response);
            });
	};
		
	$scope.addProfessor = function (isProfessor) {
      	var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'templates/professors/professor.html',
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
          size: 'sm',
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

		$scope.addDegree = function (isGraduate) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'templates/professors/degree.html',
				controller: function ($scope, $uibModalInstance, degree) {
					if (isGraduate) {
						$scope.degreeTitle = 'Add Graduate Degree';
					} else {
						$scope.degreeTitle = 'Add Undergraduate Degree';
					}
					Institution.all().success(function (response) {
						$scope.institutions = response.institutions;
					});
					$scope.ok = function () {
						$scope.degree = {
							"institutionName": $scope.institutionName,
							"degree": $scope.degree,
							"field": $scope.field,
							"graduationDate": $scope.graduationDate
						};
						$uibModalInstance.close($scope.degree);
					};

					$scope.cancel = function () {
						$uibModalInstance.dismiss('cancel');
					};
				},
				size: 'sm',
				resolve: {
					degree: function () {
						return $scope.degree;
					}
				}
			});
			modalInstance.result.then(function (degree) {
				if (isGraduate) {
					if (!$scope.professor.graduateDegrees) {
						$scope.professor.graduateDegrees = [];
					}
					$scope.professor.graduateDegrees.push(degree);
				} else {
					if (!$scope.professor.undergraduateDegrees) {
						$scope.professor.undergraduateDegrees = [];
					}
					$scope.professor.undergraduateDegrees.push(degree);
				}
				Professor.create($scope.professor._id, $scope.professor)
					.then(
					function (response) {
						console.log(response);
					},
					function (response) {
						console.log(response);
					}
					);
			});
		};

		$scope.addMinistry = function () {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'templates/professors/ministry.html',
				controller: function ($scope, $uibModalInstance, ministry) {
					$scope.ministryTitle = 'Add Ministry';
					Ministry.all().success(function (response) {
						$scope.ministries = response.ministries;
					});
					$scope.ok = function () {
						$scope.ministry = {
							"ministryName": $scope.ministryName,
							"ministrySupervisor": $scope.ministrySupervisor,
							"ministrySupervisorTitle": $scope.ministrySupervisorTitle,
							"ministrySupervisorPhoneNumber": $scope.ministrySupervisorPhoneNumber,
							"ministryDescription": $scope.ministryDescription
						};
						$uibModalInstance.close($scope.ministry);
					};

					$scope.cancel = function () {
						$uibModalInstance.dismiss('cancel');
					};
				},
				size: 'sm',
				resolve: {
					ministry: function () {
						return $scope.ministry;
					}
				}
			});
			modalInstance.result.then(function (ministry) {
				if (!$scope.professor.ministries) {
					$scope.professor.ministries = [];
				}
				$scope.professor.ministries.push(ministry);
				Professor.create($scope.professor._id, $scope.professor)
					.then(
					function (response) {
						console.log(response);
					},
					function (response) {
						console.log(response);
					}
					);
			});
		};

		$scope.addContact = function (isContact) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'templates/professors/contact.html',
				controller: function ($scope, $uibModalInstance, contact) {
					if (isContact) {
						$scope.contactTitle = 'Add Emergency Contact';
					} else {
						$scope.contactTitle = 'Add Reference';
					}
					$scope.ok = function () {
						$scope.contact = {
							"firstName": $scope.firstName,
							"middleName": $scope.middleName,
							"lastName": $scope.lastName,
							"email": $scope.email,
							"phoneNumber": $scope.phoneNumber,
							"relationship": $scope.relationship
						};
						$uibModalInstance.close($scope.contact);
					};

					$scope.cancel = function () {
						$uibModalInstance.dismiss('cancel');
					};
				},
				size: 'sm',
				resolve: {
					contact: function () {
						return $scope.contact;
					}
				}
			});
			modalInstance.result.then(function (contact) {
				if (isContact) {
					$scope.professor.emergencyContacts.push(contact);
				} else {
					$scope.professor.references.push(contact);
				}
				Professor.create($scope.professor._id, $scope.professor)
					.then(
					function (response) {
						console.log(response);
					},
					function (response) {
						console.log(response);
					}
					);
			});
		};
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
