angular.module('smsApp-semestersList', ['ngRoute', 'datatables', 'ngResource', 'ngNotificationsBar', 'ngSanitize'])
    .controller('SemesterListCtrl', function($scope, $rootScope, $routeParams, $location, $uibModal, Semester, notifications, Course) {
        Semester.all().success(function(response) {
            $scope.semesters = response.semesters;
        });

         $rootScope.weekdays = [{
            id: '1',
            name: 'Sunday'

        }, {
            id: '2',
            name: 'Monday'

        }, {
            id: '3',
            name: 'Tuesday'

        }, {
            id: '4',
            name: 'Wedesday'

        }, {
            id: '5',
            name: 'Thursday'

        }, {
            id: '6',
            name: 'Friday'

        }, {
            id: '7',
            name: 'Saterday'

        }];

        // create semester
        $scope.AddSemester = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/semesters/new.html',
                controller: function($scope, $uibModalInstance, Semester) {
                    $scope.semesterTitle = 'Add Semester';

                    $scope.semesterSubmit = function() {
                        $scope.semester = {
                            name: $scope.name,
                            startDate: $scope.startDate,
                            endDate: $scope.endDate

                        };
                        $scope.isfinished = false;

                        Semester.create($scope.semester)
                            .then(
                                function(response) {
                                    $scope.isfinished = true;
                                    notifications.showSuccess({
                                        message: 'Add semester successfully.'
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
                size: 'md',
                resolve: {
                    isfinished: function() {
                        return $scope.isfinished;
                    }
                }
            });

            modalInstance.result.then(function(isfinished) {

                Semester.all().success(function(response) {
                    $scope.semesters = response.semesters;
                });

            });
        };

        // edit semester
        $scope.editSemester = function(id) {
            Semester.get(id).success(function(res) {
                $rootScope.semester = res.semester;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/semesters/new.html',
                    controller: function($scope, $uibModalInstance, Semester) {
                        $scope.semesterTitle = 'Add Semester';
                        $scope.startDate = new Date($rootScope.semester.startDate);
                        $scope.endDate = new Date($rootScope.semester.endDate);
                        $scope.name = $rootScope.semester.name;

                        $scope.semesterSubmit = function() {
                            $rootScope.semester.name = $scope.name;
                            $rootScope.semester.startDate = $scope.startDate;
                            $rootScope.semester.endDate = $scope.endDate;

                            Semester.update($rootScope.semester._id, $rootScope.semester)
                                .then(
                                    function(response) {
                                        notifications.showSuccess({
                                            message: 'Add Course successfully.'
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
                    size: 'sm',
                    resolve: {
                        isfinished: function() {
                            return true;
                        }
                    }
                });

                modalInstance.result.then(function(isfinished) {
                    if (isfinished === true) {
                        Semester.all().success(function(response) {
                            $scope.semesters = response.semesters;
                        });
                    }
                });

            });
        };

        // create coures
        $scope.addCourse = function(semesterID, semesterName) {
            Semester.get(semesterID).success(function(res) {
                $scope.semester = res.semester;
            });
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/semesters/course.html',
                controller: function($scope, $uibModalInstance, Course, Semester) {

                    $scope.courseTitle = 'Add Course';
                    $scope.semesterName = semesterName
                    $scope.scheduleDates = [{
                        day: 3,
                        time: new Date(1970, 0, 1, 08, 00, 0)
                    }];
                    $scope.dateOff = [{
                        dateOffStart: new Date(),
                        dateOffEnd: new Date()
                    }];

                    $scope.courseSubmit = function() {
                        $scope.course = {
                            name: $scope.name,
                            startDate: $scope.startDate,
                            endDate: $scope.endDate,
                            duration: $scope.duration,
                            noMember: $scope.noMember,
                            scheduleDate: $scope.scheduleDates,
                            dateOff: $scope.dateOff

                        };
                        $uibModalInstance.close($scope.course);
                    };


                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };

                },
                size: 'md',
                resolve: {
                    course: function() {
                        return $scope.course;
                    }
                }
            });

            modalInstance.result.then(function(course) {
                if (!$scope.semester.courseList) {
                    $scope.semester.courseList = []
                }
                course._id = semesterID + '' + $scope.semester.courseList.length;
                $scope.semester.courseList.push(course);
                Semester.update($scope.semester._id, $scope.semester)
                    .then(
                        function(response) {
                            Semester.all().success(function(response) {
                                $scope.semesters = response.semesters;
                            });

                            notifications.showSuccess({
                                message: 'Add Course successfully.'
                            });
                        },
                        function(response) {
                            console.log(response);
                        }
                    );
            });

        }

        // remove semester
        $scope.removeSemester = function(id) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/alert/confirm.html',
                controller: function($scope, $uibModalInstance, Semester) {

                    $scope.comtent = 'All of course in semester will remove. \n Are you sure you want to remove?'

                    $scope.ok = function() {

                        Semester.delete(id)
                            .then(
                                function(response) {
                                    Semester.all().success(function(response) {
                                        $scope.semesters = response.semesters;
                                    });

                                    notifications.showSuccess({
                                        message: 'Add Course successfully.'
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
                    Semester.all().success(function(response) {
                        $scope.semesters = response.semesters;
                    });

                }
            });
        }; // ------------

        // edit course
        $scope.editCourse = function(semesterID, courseID) {
            Semester.get(semesterID).success(function(res) {
                $rootScope.semester = res.semester;

                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/semesters/course.html',
                    controller: function($scope, $uibModalInstance, Course, Semester) {
                        $scope.courseList = $rootScope.semester.courseList;
                        $scope.course = null;

                        for (var i = 0; i < $scope.courseList.length; i++) {
                            if ($scope.courseList[i]._id == courseID) {
                                $scope.course = $scope.courseList[i];
                            }
                        }

                        $scope.courseTitle = 'Edit Course';
                        $scope.semesterName = $rootScope.semester.name;
                        $scope.scheduleDates = $scope.course.scheduleDates;
                        $scope.dateOff = $scope.course.dateOff;

                        $scope.courseSubmit = function() {
                            // $scope.course = {
                            //     name: $scope.name,
                            //     startDate: $scope.startDate,
                            //     endDate: $scope.endDate,
                            //     duration: $scope.duration,
                            //     noMember: $scope.noMember,
                            //     scheduleDate: $scope.scheduleDates,
                            //     dateOff: $scope.dateOff

                            // };
                            // $uibModalInstance.close($scope.course);
                        };


                        $scope.cancel = function() {
                            $uibModalInstance.dismiss('cancel');
                        };

                    },
                    size: 'md',
                    resolve: {
                        course: function() {
                            return $scope.course;
                        }
                    }
                });



            });
        }; //-------------------



    });