angular.module('smsApp-studentsList', ['ngRoute'])
	.controller('StudentListCtrl', function ($scope, $location, Student) {
		$scope.search = function () {
			if ($scope.searchName) {
				Student.searchName($scope.searchName).success(function (response) {
					$scope.students = response.students;
				});
			}
			else if ($scope.searchID) {
				Student.searchID($scope.searchID).success(function (response) {
					$scope.students = response.students;
				});
			}
		};

		$scope.studentDetails = function (studentID) {
			$location.path('/student/' + studentID);
		};
	})
	.controller('StudentDetailsCtrl', function ($scope, $routeParams, $uibModal, Student, Institution, Ministry) {
		Student.get($routeParams.Id).success(function (response) {
			$scope.student = response.student;
		});

		$scope.addDegree = function (isGraduate) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'templates/students/degree.html',
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
					if (!$scope.student.graduateDegrees) {
						$scope.student.graduateDegrees = [];
					}
					$scope.student.graduateDegrees.push(degree);
				} else {
					if (!$scope.student.undergraduateDegrees) {
						$scope.student.undergraduateDegrees = [];
					}
					$scope.student.undergraduateDegrees.push(degree);
				}
				Student.create($scope.student._id, $scope.student)
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
				templateUrl: 'templates/students/ministry.html',
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
				if (!$scope.student.ministries) {
					$scope.student.ministries = [];
				}
				$scope.student.ministries.push(ministry);
				Student.create($scope.student._id, $scope.student)
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
				templateUrl: 'templates/students/contact.html',
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
					$scope.student.emergencyContacts.push(contact);
				} else {
					$scope.student.references.push(contact);
				}
				Student.create($scope.student._id, $scope.student)
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
	.controller('AddStudentsCtrl', function ($scope, $routeParams, $uibModal, Student, Institution, Ministry) {
		
		$scope.student = {
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

		$scope.addStudent = function (event) {
			 Student.insert($scope.student)
					.then(
					function (response) {
						
						alert("Insert student success...");
					},
					function (response) {
						alert("Can't insert student...");
					}
					);

		}
	 
	
	});
