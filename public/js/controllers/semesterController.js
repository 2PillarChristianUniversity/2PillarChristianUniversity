angular.module('smsApp-semestersList', ['ngRoute', 'datatables', 'ngResource', 'ngNotificationsBar', 'ngSanitize'])
    .controller('SemesterListCtrl', function($scope, $rootScope, $routeParams, $location, $uibModal, Semester, notifications, Course) {
        Semester.all().success(function(response) {
            $scope.semesters = response.semesters;
        });

        // $rootScope.weekdays = [{
        //     1: 'MonDay'

        // },{
        //     2: 'tusdate'

        // }];
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

                        Semester.create($scope.semester)
                            .then(
                                function(response) {
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
                size: 'sm'
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
                            console.log(response);
                        },
                        function(response) {
                            console.log(response);
                        }
                    );
            });



        }

    });