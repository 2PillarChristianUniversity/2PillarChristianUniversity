angular.module('smsApp-semestersList', ['ngRoute', 'datatables', 'ngResource', 'ngNotificationsBar',
        'ngSanitize', 'ui.calendar'
    ])
    .controller('SemesterListCtrl', function($scope, $rootScope, $routeParams, $location,
        $uibModal, Semester, notifications, Course, $compile, $filter, uiCalendarConfig, Student) {
         Semester.all().success(function(response) {
            $scope.semesters = response.semesters;
            // console.log($scope.semesters);
        });

        // function CalendarCtrl($scope,$compile,uiCalendarConfig) {
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        $scope.changeTo = 'English';

        /* event source that calls a function on every view switch */
        $scope.eventsF = function (start, end, bool, callback) {
           // getting the events and feeding the calendar
            var startDate = $filter('date')(new Date(start), "yyyy-MM-dd");
            var endDate = $filter('date')(new Date(end), "yyyy-MM-dd");

            Student.studentCourse('000001', startDate, endDate).success(function (response) {
                $scope.student = response.student;
                var events = [];
                if ($scope.student.length) {
                    angular.forEach(response.student[0].Courses, function(value, key) {
                        var count = value.scheduleDate.length;
                        value.startDate = value.startDate.split('T')[0];
                        value.endDate = value.endDate.split('T')[0];

                        var dateOfStartDate = new Date(value.startDate).getTime();
                        var inputDate = new Date(value.startDate);
                        if(new Date(start).getTime() > dateOfStartDate) {
                            inputDate = new Date(start);
                        }
                        var startDate = $filter('date')(inputDate, "yyyy-MM-dd");
                        for(var i = 0; i < count ; i++) {
                            var d = $filter('filter')($rootScope.weekdays, {id: value.scheduleDate[i].day});
                            var time = new Date(value.scheduleDate[i].time);
                            var hour = time.getHours();
                            var minutes = time.getMinutes();

                            var date = moment(startDate + ' ' + hour + ':' + minutes, "YYYY-MM-DD h:mm").day(d[0].name);
                            var endTime = new Date(value.endDate).getTime();
                            while(endTime >= date.valueOf()) {
                                var data = {
                                    title: value.name,
                                    start: new Date(date),
                                    allDay: false
                                };
                                this.push(data);

                                date = date.weekday(parseInt(d[0].id) - 1 + 7);
                            }
                        }
                    }, events);
                }

                callback(events);
            });
        };

        /* Change View */
        $scope.changeView = function(view,calendar) {
          uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
        };
        /* Change View */
        $scope.renderCalendar = function(calendar) {
            if(uiCalendarConfig.calendars[calendar]){
              uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        };
         /* Render Tooltip */
        $scope.eventRender = function( event, element, view ) {
            element.attr({'tooltip': event.title,
                          'tooltip-append-to-body': true});
            $compile(element)($scope);
        };
        /* config object */
        $scope.uiConfig = {
            calendar: {
                height: 450,
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                eventRender: $scope.eventRender
            }
        };

        $scope.changeLang = function() {
            $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        };
        /* event sources array*/
        $scope.eventSources = [$scope.eventsF];

        // end calendar

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
            name: 'Wednesday'

        }, {
            id: '5',
            name: 'Thursday'

        }, {
            id: '6',
            name: 'Friday'

        }, {
            id: '7',
            name: 'Saturday'

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
                            is_deleted: "false",
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

                        $scope.parseDate = function(date) {
                            return new Date(Date.parse(date));

                        };

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
            // Semester.get(semesterID).success(function(res) {
            //     $scope.semester = res.semester;
            // });
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/semesters/course.html',
                controller: function($scope, $uibModalInstance, Course, Semester) {

                    $scope.courseTitle = 'Add Course';
                    $scope.semesterName = semesterName
                    $scope.scheduleDates = [{
                        // day: 3,
                        // time: new Date(1970, 0, 1, 08, 00, 0)
                    }];
                    $scope.dateOff = [{
                        // dateOffStart: new Date(),
                        // dateOffEnd: new Date()
                    }];

                    $scope.courseSubmit = function() {
                        $scope.course = {
                            semesters: '',
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
                $scope.coures = course;
                $scope.coures.semesters = semesterID;

                console.log($scope.coures);
                Course.insert($scope.coures)
                    .then(
                        function(response) {
                            notifications.showSuccess({
                                message: 'Add Course successfully.'
                            });
                            Semester.all().success(function(response) {
                                $scope.semesters = response.semesters;
                            });
                        },
                        function(response) {
                            console.log(response);
                        });
            });

        };
        // delete course
        $scope.deleteCourse = function(id) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/alert/confirm.html',
                controller: function($scope, $uibModalInstance, Course) {

                    $scope.comtent = 'Are you sure you want to delete?'

                    $scope.ok = function() {

                        Course.delete(id)
                            .then(
                                function(response) {
                                    Course.all().success(function(response) {
                                        $scope.courses = response.courses;
                                    });
                                    Semester.all().success(function(response) {
                                        $scope.semesters = response.semesters;
                                    });

                                    notifications.showSuccess({
                                        message: 'Delete course successfully.'
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
        };

        // delete semester
        $scope.deleteSemester = function(id) {
            Semester.get(id).success(function(res) {
                $rootScope.semester = res.semester;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/alert/confirm.html',
                    controller: function($scope, $uibModalInstance, Semester) {
                        $scope.comtent = 'All of course in semester will remove. \n Are you sure you want to remove?'
                        $scope.ok = function() {
                            $rootScope.semester.is_deleted = "true";

                            Semester.update($rootScope.semester._id, $rootScope.semester)
                                .then(
                                    function(response) {
                                        notifications.showSuccess({
                                            message: 'Delete semester successfully.'
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
        // ---------------

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
        $scope.editCourse = function(semesterName, courseID) {
            console.log(courseID);
            Course.get(courseID).success(function(res) {
                $rootScope.course = res.course;
                console.log($rootScope.course);
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/semesters/course.html',
                    controller: function($scope, $uibModalInstance, Semester, Course) {

                        $scope.parseDate = function(date) {
                            return new Date(Date.parse(date));

                        };

                        $scope.courseTitle = 'Edit Course';
                        $scope.semesterName = semesterName;
                        $scope.name = $rootScope.course.name;
                        $scope.startDate = new Date($rootScope.course.startDate);
                        $scope.endDate = new Date($rootScope.course.endDate);

                        $scope.courseSubmit = function() {
                            $rootScope.course.name = $scope.name;
                            $rootScope.course.startDate = $scope.startDate;
                            $rootScope.course.endDate = $scope.endDate;

                            Course.update($rootScope.course._id, $rootScope.course)
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
         // -------------------

    })
    .controller('SemesterTreeviewCtrl', function($scope, $rootScope, $routeParams,
        $location, $uibModal, Semester, notifications, Course) {

        Semester.getTreeList().success(function(response) {
                    $scope.semesters_list = response.semesters;
                    $scope.courses_list = response.courses;
                    $scope.semesters_list.forEach(function (semester) {
                         $scope.courses_list.forEach(function (course) {
                            if(semester._id == course.semesters) {
                                if(!semester.courses) {
                                    semester.courses = [];
                                }
                                semester.courses.push(course);
                            }
                         });
                    });
                    console.log($scope.semesters_list);

                });


        var apple_selected, tree, treedata_avm, treedata_geography;
        $scope.my_tree_handler = function(branch) {
            var _ref;
            $scope.output = "You selected: " + branch.label;
            if ((_ref = branch.data) != null ? _ref.description : void 0) {
                return $scope.output += '(' + branch.data.description + ')';
            }
        };

        apple_selected = function(branch) {
            return $scope.output = "APPLE! : " + branch.label;
        };
        treedata_avm = [{
            label: '2013 - 2014',
            children: [{
                label: 'Semester 1',
                data: {
                    description: "man's best friend"
                }
            }, {
                label: 'Semester 2',
                data: {
                    description: "Felis catus"
                }
            }, {
                label: 'Semester 3',
                data: {
                    description: "hungry, hungry"
                }
            }, {
                label: 'Semester 4',
                children: ['Course 1 ', 'Course 2', 'Course 3']
            }]
        }, {
            label: '2014 - 2015',
            data: {
                definition: "A plant or part of a plant used as food, typically as accompaniment to meat or fish, such as a cabbage, potato, carrot, or bean.",
                data_can_contain_anything: true
            },
            onSelect: function(branch) {
                return $scope.output = "Vegetable: " + branch.data.definition;
            },
            children: [{
                label: 'Oranges'
            }, {
                label: 'Apples',
                children: [{
                    label: 'Granny Smith',
                    onSelect: apple_selected
                }, {
                    label: 'Red Delicous',
                    onSelect: apple_selected
                }, {
                    label: 'Fuji',
                    onSelect: apple_selected
                }]
            }]
        }, {
            label: '2015 - 2016',
            children: [{
                label: 'Rock',
                children: ['Igneous', 'Sedimentary', 'Metamorphic']
            }, {
                label: 'Metal',
                children: ['Aluminum', 'Steel', 'Copper']
            }, {
                label: 'Plastic',
                children: [{
                    label: 'Thermoplastic',
                    children: ['polyethylene', 'polypropylene', 'polystyrene', ' polyvinyl chloride']
                }, {
                    label: 'Thermosetting Polymer',
                    children: ['polyester', 'polyurethane', 'vulcanized rubber', 'bakelite', 'urea-formaldehyde']
                }]
            }]
        }];


        treedata_geography = [{
            label: 'North America',
            children: [{
                label: 'Canada',
                children: ['Toronto', 'Vancouver']
            }, {
                label: 'USA',
                children: ['New York', 'Los Angeles']
            }, {
                label: 'Mexico',
                children: ['Mexico City', 'Guadalajara']
            }]
        }, {
            label: 'South America',
            children: [{
                label: 'Venezuela',
                children: ['Caracas', 'Maracaibo']
            }, {
                label: 'Brazil',
                children: ['Sao Paulo', 'Rio de Janeiro']
            }, {
                label: 'Argentina',
                children: ['Buenos Aires', 'Cordoba']
            }]
        }];
        $scope.my_data = treedata_avm;
        $scope.try_changing_the_tree_data = function() {
            if ($scope.my_data === treedata_avm) {
                return $scope.my_data = treedata_geography;
            } else {
                return $scope.my_data = treedata_avm;
            }
        };
        $scope.my_tree = tree = {};
        $scope.try_async_load = function() {
            $scope.my_data = [];
            $scope.doing_async = true;
            return $timeout(function() {
                if (Math.random() < 0.5) {
                    $scope.my_data = treedata_avm;
                } else {
                    $scope.my_data = treedata_geography;
                }
                $scope.doing_async = false;
                return tree.expand_all();
            }, 1000);
        };
        return $scope.try_adding_a_branch = function() {
            var b;
            b = tree.get_selected_branch();
            return tree.add_branch(b, {
                label: 'New Branch',
                data: {
                    something: 42,
                    "else": 43
                }
            });
        };

    });
