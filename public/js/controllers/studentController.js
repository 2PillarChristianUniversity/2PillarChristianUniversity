angular.module('smsApp-studentsList', ['ngRoute', 'datatables', 'ngResource', 'ngNotificationsBar', 'ngSanitize'])
	.controller('StudentListCtrl', function($scope, $location, Student, $resource, $uibModal, notifications) {
		$scope.search = function() {

			if ($scope.searchName) {
				Student.searchName($scope.searchName).success(function(response) {
					$scope.students = response.students;
				});
			} else if ($scope.searchID) {
				Student.searchID($scope.searchID).success(function(response) {
					$scope.students = response.students;
				});
			}
		};

		$scope.studentDetails = function(studentID) {
			$location.path('/student/' + studentID);
		};

		$scope.studentDelete = function (Student) {
			Student.remove();
		};
		
		$scope.addStudents = function() {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'templates/students/new.html',
				controller: function($scope, $uibModalInstance, Student) {
					$scope.studentTitle = 'Add Student';

					$scope.studentSubmit = function() {
						$scope.student = {
							addressLine1: $scope.addressLine1,
							birthDate: $scope.birthDate,
							city: $scope.city,
							email: $scope.email,
							firstName: $scope.firstName,
							gender: $scope.gender,
							lastName: $scope.lastName,
							middleName: $scope.middleName,
							phoneNumber: $scope.phoneNumber,
							state: $scope.state,
							zipCode: $scope.zipCode,
							graduationDate: $scope.graduationDate,
							applicationDate: $scope.applicationDate,
							acceptanceNotificationDate: $scope.acceptanceNotificationDate
						};

						Student.insert($scope.student)
							.then(
								function(response) {
									notifications.showSuccess({
										message: 'Add student successfully.'
									});
									$uibModalInstance.close();
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
	.controller('StudentDetailsCtrl', function($scope, $routeParams, $uibModal, Student, Institution, Ministry) {
		Student.get($routeParams.Id).success(function(response) {
			$scope.student = response.student;
		});

		$scope.addDegree = function(isGraduate) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'templates/students/degree.html',
				controller: function($scope, $uibModalInstance, degree) {
					if (isGraduate) {
						$scope.degreeTitle = 'Add Graduate Degree';
					} else {
						$scope.degreeTitle = 'Add Undergraduate Degree';
					}
					Institution.all().success(function(response) {
						$scope.institutions = response.institutions;
					});
					$scope.ok = function() {
						$scope.degree = {
							"institutionName": $scope.institutionName,
							"degree": $scope.degree,
							"field": $scope.field,
							"graduationDate": $scope.graduationDate
						};
						$uibModalInstance.close($scope.degree);
					};

					$scope.cancel = function() {
						$uibModalInstance.dismiss('cancel');
					};
				},
				size: 'sm',
				resolve: {
					degree: function() {
						return $scope.degree;
					}
				}
			});


			modalInstance.result.then(function(degree) {
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
						function(response) {
							console.log(response);
						},
						function(response) {
							console.log(response);
						}
					);
			});
		};

		$scope.addMinistry = function() {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'templates/students/ministry.html',
				controller: function($scope, $uibModalInstance, ministry) {
					$scope.ministryTitle = 'Add Ministry';
					Ministry.all().success(function(response) {
						$scope.ministries = response.ministries;
					});
					$scope.ok = function() {
						$scope.ministry = {
							"ministryName": $scope.ministryName,
							"ministrySupervisor": $scope.ministrySupervisor,
							"ministrySupervisorTitle": $scope.ministrySupervisorTitle,
							"ministrySupervisorPhoneNumber": $scope.ministrySupervisorPhoneNumber,
							"ministryDescription": $scope.ministryDescription
						};
						$uibModalInstance.close($scope.ministry);
					};

					$scope.cancel = function() {
						$uibModalInstance.dismiss('cancel');
					};
				},
				size: 'sm',
				resolve: {
					ministry: function() {
						return $scope.ministry;
					}
				}
			});

			modalInstance.result.then(function(ministry) {
				if (!$scope.student.ministries) {
					$scope.student.ministries = [];
				}
				$scope.student.ministries.push(ministry);
				Student.create($scope.student._id, $scope.student)
					.then(
						function(response) {
							console.log(response);
						},
						function(response) {
							console.log(response);
						}
					);
			});
		};

		$scope.addContact = function(isContact) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'templates/students/contact.html',
				controller: function($scope, $uibModalInstance, contact) {
					if (isContact) {
						$scope.contactTitle = 'Add Emergency Contact';
					} else {
						$scope.contactTitle = 'Add Reference';
					}
					$scope.ok = function() {
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

					$scope.cancel = function() {
						$uibModalInstance.dismiss('cancel');
					};
				},
				size: 'sm',
				resolve: {
					contact: function() {
						return $scope.contact;
					}
				}
			});
			modalInstance.result.then(function(contact) {
				if (isContact) {
					$scope.student.emergencyContacts.push(contact);
				} else {
					$scope.student.references.push(contact);
				}
				Student.create($scope.student._id, $scope.student)
					.then(
						function(response) {
							console.log(response);
						},
						function(response) {
							console.log(response);
						}
					);
			});
		};
	})
	.controller('AddStudentsCtrl', function ($scope, $routeParams, $location, $uibModal, Student, Institution, Ministry) {		
		$scope.student = {
		// 	_id: "",
		// 	email: "",
		// 	firstName: "",
		// 	middleName: "",
		// 	lastName: "",
		// 	birthDate: "",
			gender: "M",
		// 	phoneNumber: "",
		// 	addressLine1: "",
		// 	city: "",
		// 	state: "",
		// 	zipCode: "",
		};
		
		$scope.addStudent = function (event) {
			 Student.insert($scope.student)
					.then(
					function (response) {				
						$location.path('/students');
					},
					function (response) {
						var modalInstance = $uibModal.open({
						animation: true,
						title: 'Efor',
						templateUrl: 'templates/alert/warning.html',
						controller: function ($scope, $uibModalInstance) {
								$scope.errorTitle = 'ERROR';
								$scope.errorContent = "Can't insert student...";
								$scope.ok = function () {
									$uibModalInstance.dismiss();
								}

							},
							size: 'sm'
						});
			});

		} 
	
	});

