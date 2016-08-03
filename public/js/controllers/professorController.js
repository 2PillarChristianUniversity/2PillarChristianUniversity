angular.module('smsApp-professorsList', ['ngRoute'])
  .controller('ProfessorListCtrl', function ($scope, $location, Professor) {
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
	.controller('AddProfessorsCtrl', function ($scope, $routeParams, $uibModal, Professor, Institution, Ministry) {
		
		$scope.professor = {
			_id: "",
			email: "",
			firstName: "",
			middleName: "",
			lastName: "",
			birthDate: "",
			gender: "M",
			phoneNumber: "",
			addressLine1: "",
			city: "",
			state: "",
			zipCode: "",
		};

		$scope.addProfessor = function (event) {
			 Professor.insert($scope.professor)
					.then(
					function (response) {
						
						alert("Insert professor success...");
					},
					function (response) {
						alert("Can't insert professor...");
					}
					);

		}
	 
	
	});
