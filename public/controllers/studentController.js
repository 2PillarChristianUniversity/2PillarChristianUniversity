angular.module('smsApp-studentsList', ['ngRoute', 'datatables', 'ngResource', 'ngNotificationsBar', 'ngSanitize', 'ngSecurity'])
    .controller('StudentListCtrl', function($scope, $location, Student, $resource, $uibModal,
        notifications, $routeParams, $rootScope, Financial, $security) {

        if ($security.hasPermission('student')) {
            $location.path('/404_page/');
        }

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

        // delete student
        $scope.deleteStudent = function(id) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/alert/confirm.html',
                controller: function($scope, $uibModalInstance, Student) {
                    $scope.comtent = 'Are you sure you want to delete?'
                    $scope.ok = function() {
                        Student.delete(id)
                            .then(
                                function(response) {
                                    Student.all().success(function(response) {
                                        $scope.students = response.students;
                                    });
                                    notifications.showSuccess({
                                        message: 'Delete student Successfully.'
                                    });
                                    $('#tr_student_' + id).remove();
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
                    // Student.all().success(function(response) {
                    //     $scope.students = response.students;
                    // });
                }
            });
        };

        // edit student
        $scope.editStudent = function(id) {
            Student.get(id).success(function(res) {
                $rootScope.student = res.student;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/students/new.html',
                    controller: function($scope, $uibModalInstance, Student) {
                        $scope.studentTitle = 'Edit Student';
                        $scope.birthDate = new Date($rootScope.student.birthDate);
                        $scope.graduationDate = new Date($rootScope.student.graduationDate);
                        $scope.applicationDate = new Date($rootScope.student.applicationDate);
                        $scope.acceptanceNotificationDate = new Date($rootScope.student.acceptanceNotificationDate);
                        $scope.email = $rootScope.student.email;
                        $scope.firstName = $rootScope.student.firstName;
                        $scope.middleName = $rootScope.student.middleName;
                        $scope.lastName = $rootScope.student.lastName;
                        $scope.gender = $rootScope.student.gender;
                        $scope.phoneNumber = $rootScope.student.phoneNumber;
                        $scope.addressLine1 = $rootScope.student.addressLine1;
                        $scope.city = $rootScope.student.city;
                        $scope.state = $rootScope.student.state;
                        $scope.zipCode = $rootScope.student.zipCode;

                        $scope.studentSubmit = function() {
                            $rootScope.student.email = $scope.email;
                            $rootScope.student.firstName = $scope.firstName;
                            $rootScope.student.middleName = $scope.middleName;
                            $rootScope.student.lastName = $scope.lastName;
                            $rootScope.student.birthDate = $scope.birthDate;
                            $rootScope.student.gender = $scope.gender;
                            $rootScope.student.phoneNumber = $scope.phoneNumber;
                            $rootScope.student.addressLine1 = $scope.addressLine1;
                            $rootScope.student.city = $scope.city;
                            $rootScope.student.state = $scope.state;
                            $rootScope.student.zipCode = $scope.zipCode;
                            $rootScope.student.graduationDate = $scope.graduationDate;
                            $rootScope.student.applicationDate = $scope.applicationDate;
                            $rootScope.student.acceptanceNotificationDate = $scope.acceptanceNotificationDate;

                            Student.update($rootScope.student._id, $rootScope.student)
                                .then(
                                    function(response) {
                                        notifications.showSuccess({
                                            message: 'Update student successfully.'
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
                        Student.all().success(function(response) {
                            $scope.students = response.students;
                        });
                    }
                });

            });
        };

        // add student
        $scope.addStudents = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/students/new.html',
                controller: function($scope, $uibModalInstance, Student) {
                    $scope.studentTitle = 'Add Student';
                    $scope.gender = "M";

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

.controller('StudentDetailsCtrl', function($scope, $routeParams, $location, $uibModal, Student, Institution, Ministry, $rootScope, notifications, Semester, Financial) {
    $rootScope.index = -1;
    console.log($routeParams.Id);
    Student.get($routeParams.Id).success(function(response) {
        $scope.student = response.student;
    });

    Financial.searchID($routeParams.Id).success(function(response) {
        $scope.financials = response.financials;
    });

    // add degree
    $scope.addDegree = function(isGraduate) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/students/degree.html',
            controller: function($scope, $uibModalInstance, degree) {
                Institution.all().success(function(response) {
                    $scope.institutions = response.institutions;
                });
                if (isGraduate) {
                    $scope.degreeTitle = 'Add Graduate Degree';
                } else {
                    $scope.degreeTitle = 'Add Undergraduate Degree';
                }
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
            size: 'md',
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
            Student.update($scope.student._id, $scope.student)
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

    // edit degree
    $scope.editDegree = function(studentID, degreeID, isGraduate) {
        Student.get(studentID).success(function(res) {
            $rootScope.student = res.student;
        });
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/students/degree.html',
            controller: function($scope, $uibModalInstance, degree, Student) {
                Institution.all().success(function(response) {
                    $scope.institutions = response.institutions;
                });
                $rootScope.degree = null;
                $scope.graduateDegrees = [];
                $scope.undergraduateDegrees = [];
                if (isGraduate) {
                    $scope.graduateDegrees = $rootScope.student.graduateDegrees;
                    for (var i = 0; i < $scope.graduateDegrees.length; i++) {
                        if ($scope.graduateDegrees[i]._id == degreeID) {
                            $rootScope.degree = $scope.graduateDegrees[i];
                            $rootScope.index = i;
                        }
                    }
                } else {
                    $scope.undergraduateDegrees = $rootScope.student.undergraduateDegrees;
                    for (var i = 0; i < $scope.undergraduateDegrees.length; i++) {
                        if ($scope.undergraduateDegrees[i]._id == degreeID) {
                            $rootScope.degree = $scope.undergraduateDegrees[i];
                            $rootScope.index = i;
                        }
                    }
                }
                console.log($scope.degree);
                $scope.degreeTitle = 'Edit Degree';
                $scope.institutionName = $rootScope.degree.institutionName;
                $scope.degree = $rootScope.degree.degree;
                $scope.field = $rootScope.degree.field;
                $scope.graduationDate = new Date($rootScope.degree.graduationDate);

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
            size: 'md',
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
                $scope.student.graduateDegrees.splice($rootScope.index, 1, degree);
            } else {
                if (!$scope.student.undergraduateDegrees) {
                    $scope.student.undergraduateDegrees = [];
                }
                $scope.student.undergraduateDegrees.splice($rootScope.index, 1, degree);
            }
            Student.update($scope.student._id, $scope.student)
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

    // delete degree
    $scope.deleteDegree = function(studentID, degreeID, isGraduate) {
        Student.get(studentID).success(function(res) {
            $rootScope.student = res.student;
        });
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/alert/confirm.html',
            controller: function($scope, $uibModalInstance, degree, Student) {
                $scope.comtent = 'Are you sure you want to delete?'
                $scope.degree = null;
                $scope.graduateDegrees = [];
                $scope.undergraduateDegrees = [];
                if (isGraduate) {
                    $scope.graduateDegrees = $rootScope.student.graduateDegrees;
                    for (var i = 0; i < $scope.graduateDegrees.length; i++) {
                        if ($scope.graduateDegrees[i]._id == degreeID) {
                            $scope.degree = $scope.graduateDegrees[i];
                            $rootScope.index = i;
                        }
                    }
                } else {
                    $scope.undergraduateDegrees = $rootScope.student.undergraduateDegrees;
                    for (var i = 0; i < $scope.undergraduateDegrees.length; i++) {
                        if ($scope.undergraduateDegrees[i]._id == degreeID) {
                            $scope.degree = $scope.undergraduateDegrees[i];
                            $rootScope.index = i;
                        }
                    }
                }
                $scope.ok = function() {
                    $uibModalInstance.close($scope.degree);
                };
                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: 'md',
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
                $scope.student.graduateDegrees.splice($rootScope.index, 1);
            } else {
                if (!$scope.student.undergraduateDegrees) {
                    $scope.student.undergraduateDegrees = [];
                }
                $scope.student.undergraduateDegrees.splice($rootScope.index, 1);
            }
            Student.update($scope.student._id, $scope.student)
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

    // add ministry
    $scope.addMinistry = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/students/ministry.html',
            controller: function($scope, $uibModalInstance, ministry) {
                $scope.ministryTitle = 'Add Ministry';
                Institution.all().success(function(response) {
                    $scope.institutions = response.institutions;
                });
                $scope.ok = function() {
                    $scope.ministry = {
                        "ministryName": $scope.institutionName,
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
            size: 'md',
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
            Student.update($scope.student._id, $scope.student)
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

    // edit ministry
    $scope.editMinistry = function(studentID, ministryID) {
        console.log("Edit ministry index  = " + $scope.index);
        Student.get(studentID).success(function(res) {
            $rootScope.student = res.student;
        });
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/students/ministry.html',
            controller: function($scope, $uibModalInstance, Ministry, Student) {
                Institution.all().success(function(response) {
                    $scope.institutions = response.institutions;
                });
                $scope.ministries = [];
                $scope.ministries = $rootScope.student.ministries;
                $scope.ministry = null;

                for (var i = 0; i < $scope.ministries.length; i++) {
                    if ($scope.ministries[i]._id == ministryID) {
                        $scope.ministry = $scope.ministries[i];
                        $rootScope.index = i;
                    }
                }
                $scope.ministryTitle = 'Edit Ministry';
                $scope.institutionName = $scope.ministry.ministryName;
                $scope.ministrySupervisor = $scope.ministry.ministrySupervisor;
                $scope.ministrySupervisorTitle = $scope.ministry.ministrySupervisorTitle;
                $scope.ministrySupervisorPhoneNumber = $scope.ministry.ministrySupervisorPhoneNumber;
                $scope.ministryDescription = $scope.ministry.ministryDescription;

                $scope.ok = function() {
                    $scope.ministry = {
                        "ministryName": $scope.institutionName,
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
            size: 'md',
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
            console.log($rootScope.index);
            $scope.student.ministries.splice($rootScope.index, 1, ministry);
            Student.update($scope.student._id, $scope.student)
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

    // delete ministry
    $scope.deleteMinistry = function(studentID, ministryID) {
        Student.get(studentID).success(function(res) {
            $rootScope.student = res.student;
        });
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/alert/confirm.html',
            controller: function($scope, $uibModalInstance, Ministry, Student) {
                $scope.comtent = 'Are you sure you want to delete?'
                $scope.ministries = [];
                $scope.ministries = $rootScope.student.ministries;
                $scope.ministry = null;

                for (var i = 0; i < $scope.ministries.length; i++) {
                    if ($scope.ministries[i]._id == ministryID) {
                        $scope.ministry = $scope.ministries[i];
                        $rootScope.index = i;
                    }
                }
                $scope.ok = function() {
                    $uibModalInstance.close($scope.ministry);
                };
                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: 'md',
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
            console.log($rootScope.index);
            $scope.student.ministries.splice($rootScope.index, 1);
            Student.update($scope.student._id, $scope.student)
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

    // add contact
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
            size: 'md',
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
            Student.update($scope.student._id, $scope.student)
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

    // edit contact
    $scope.editContact = function(studentID, contactID, isGraduate) {
        Student.get(studentID).success(function(res) {
            $rootScope.student = res.student;
        });
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/students/contact.html',
            controller: function($scope, $uibModalInstance, contact, Student) {
                Institution.all().success(function(response) {
                    $scope.institutions = response.institutions;
                });
                $scope.contact = null;
                $scope.emergencyContacts = [];
                $scope.references = [];
                if (isGraduate) {
                    $scope.emergencyContacts = $rootScope.student.emergencyContacts;
                    for (var i = 0; i < $scope.emergencyContacts.length; i++) {
                        if ($scope.emergencyContacts[i]._id == contactID) {
                            $scope.contact = $scope.emergencyContacts[i];
                            $rootScope.index = i;
                        }
                    }
                } else {
                    $scope.references = $rootScope.student.references;
                    for (var i = 0; i < $scope.references.length; i++) {
                        if ($scope.references[i]._id == contactID) {
                            $scope.contact = $scope.references[i];
                            $rootScope.index = i;
                        }
                    }
                }
                $scope.degreeTitle = 'Edit Graduate Degree';
                $scope.firstName = $scope.contact.firstName;
                $scope.middleName = $scope.contact.middleName;
                $scope.lastName = $scope.contact.lastName;
                $scope.email = $scope.contact.email;
                $scope.phoneNumber = $scope.contact.phoneNumber;
                $scope.relationship = $scope.contact.relationship;

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
            size: 'md',
            resolve: {
                contact: function() {
                    return $scope.contact;
                }
            }
        });
        modalInstance.result.then(function(contact) {
            if (isGraduate) {
                if (!$scope.student.emergencyContacts) {
                    $scope.student.emergencyContacts = [];
                }
                $scope.student.emergencyContacts.splice($rootScope.index, 1, contact);
            } else {
                if (!$scope.student.references) {
                    $scope.student.references = [];
                }
                $scope.student.references.splice($rootScope.index, 1, contact);
            }
            Student.update($scope.student._id, $scope.student)
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

    // delete contact
    $scope.deleteContact = function(studentID, contactID, isGraduate) {
        Student.get(studentID).success(function(res) {
            $rootScope.student = res.student;
        });
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/alert/confirm.html',
            controller: function($scope, $uibModalInstance, contact, Student) {
                $scope.comtent = 'Are you sure you want to delete?'
                $scope.contact = null;
                $scope.emergencyContacts = [];
                $scope.references = [];
                if (isGraduate) {
                    $scope.emergencyContacts = $rootScope.student.emergencyContacts;
                    for (var i = 0; i < $scope.emergencyContacts.length; i++) {
                        if ($scope.emergencyContacts[i]._id == contactID) {
                            $scope.contact = $scope.emergencyContacts[i];
                            $rootScope.index = i;
                        }
                    }
                } else {
                    $scope.references = $rootScope.student.references;
                    for (var i = 0; i < $scope.references.length; i++) {
                        if ($scope.references[i]._id == contactID) {
                            $scope.contact = $scope.references[i];
                            $rootScope.index = i;
                        }
                    }
                }
                $scope.ok = function() {
                    $uibModalInstance.close($scope.contact);
                };
                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: 'md',
            resolve: {
                contact: function() {
                    return $scope.contact;
                }
            }
        });
        modalInstance.result.then(function(contact) {
            if (isGraduate) {
                if (!$scope.student.emergencyContacts) {
                    $scope.student.emergencyContacts = [];
                }
                $scope.student.emergencyContacts.splice($rootScope.index, 1);
            } else {
                if (!$scope.student.references) {
                    $scope.student.references = [];
                }
                $scope.student.references.splice($rootScope.index, 1);
            }
            Student.update($scope.student._id, $scope.student)
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

    // add request
    $scope.addRequest = function(stuID) {
        Student.get(stuID).success(function(res) {
            $rootScope.student = res.student;
        });
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/students/financial.html',
            controller: function($scope, $uibModalInstance, Financial, Student) {
                $scope.financialTitle = 'Send request';
                Semester.all().success(function(response) {
                    $scope.semesters = response.semesters;
                    console.log($scope.semesters);
                });
                $scope.studentID = $rootScope.student._id;
                $scope.studentEmail = $rootScope.student.email;
                $scope.status = "Waiting";

                $scope.ok = function() {
                    $scope.financial = {
                        studentID: $scope.studentID,
                        semester: $scope.semester,
                        monthlyPayment: $scope.monthlyPayment,
                        status: $scope.status,
                        comment: $scope.comment
                    };
                    $uibModalInstance.close($scope.financial);
                };
                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: 'md',
            resolve: {
                financial: function() {
                    return $scope.financial;
                }
            }
        });
        modalInstance.result.then(function(financial) {
            $scope.financial = financial;
            console.log($scope.financial);
            Financial.insert($scope.financial)
                .then(
                    function(response) {
                        notifications.showSuccess({
                            message: 'Add Financial successfully.'
                        });
                        Financial.all().success(function(response) {
                            $scope.courses = response.courses;
                        });
                    },
                    function(response) {
                        console.log(response);
                    });


        });
    };

    // edit financial
    $scope.editFinancial = function(studentID, financialID) {
        Student.get(studentID).success(function(res) {
            $rootScope.student = res.student;
        });
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/students/financial.html',
            controller: function($scope, $uibModalInstance, Ministry, Student) {

                Semester.all().success(function(response) {
                    $scope.semesters = response.semesters;
                });
                $scope.financials = [];
                $scope.financials = $rootScope.student.financials;
                $scope.request = null;
                for (var i = 0; i < $scope.financials.length; i++) {
                    if ($scope.financials[i]._id == financialID) {
                        $scope.request = $scope.financials[i];
                        $rootScope.index = i;
                    }
                }
                $scope.ministryTitle = 'Edit Request';
                $scope.studentID = $scope.request.studentID;
                $scope.studentEmail = $rootScope.student.email;
                $scope.semester = $scope.request.semester;
                $scope.monthlyPayment = $scope.request.monthlyPayment;
                $scope.status = $scope.request.status;
                $scope.comment = $scope.request.comment;

                $scope.ok = function() {
                    $scope.request = {
                        "studentID": $scope.studentID,
                        "semester": $scope.semester,
                        "monthlyPayment": $scope.monthlyPayment,
                        "status": $scope.status,
                        "comment": $scope.comment
                    };
                    $uibModalInstance.close($scope.request);
                };
                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: 'md',
            resolve: {
                request: function() {
                    return $scope.request;
                }
            }
        });
        modalInstance.result.then(function(request) {
            if (!$scope.student.financials) {
                $scope.student.financials = [];
            }
            console.log($rootScope.index);
            $scope.student.financials.splice($rootScope.index, 1, request);
            Student.update($scope.student._id, $scope.student)
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

    // delete financial
    $scope.deleteFinancial = function(studentID, financialID) {
        Student.get(studentID).success(function(res) {
            $rootScope.student = res.student;
        });
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/alert/confirm.html',
            controller: function($scope, $uibModalInstance, Ministry, Student) {
                $scope.comtent = 'Are you sure you want to delete?'
                $scope.financials = [];
                $scope.financials = $rootScope.student.financials;
                $scope.request = null;
                for (var i = 0; i < $scope.financials.length; i++) {
                    if ($scope.financials[i]._id == financialID) {
                        $scope.request = $scope.financials[i];
                        $rootScope.index = i;
                    }
                }
                $scope.ok = function() {
                    $uibModalInstance.close($scope.request);
                };
                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: 'md',
            resolve: {
                request: function() {
                    return $scope.request;
                }
            }
        });
        modalInstance.result.then(function(request) {
            if (!$scope.student.financials) {
                $scope.student.financials = [];
            }
            console.log($rootScope.index);
            $scope.student.financials.splice($rootScope.index, 1);
            Student.update($scope.student._id, $scope.student)
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


});