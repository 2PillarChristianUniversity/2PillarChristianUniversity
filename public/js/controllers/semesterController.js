angular.module('smsApp-semestersList', ['ngRoute', 'datatables', 'ngResource', 'ngNotificationsBar',
        'ngSanitize', 'ui.calendar'
    ])
    .controller('SemesterListCtrl', function($scope, $rootScope, $routeParams, $location,
        $uibModal, Semester, notifications, Course, $compile, uiCalendarConfig) {

         Semester.all().success(function(response) {
                    $scope.semesters = response.semesters;
                    // console.log($scope.semesters);
                });

        // function CalendarCtrl($scope,$compile,uiCalendarConfig) {
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        $scope.changeTo = 'Hungarian';
        /* event source that pulls from google.com */
        $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event', // an option!
            currentTimezone: 'America/Chicago' // an option!
        };
        /* event source that contains custom events on the scope */
        $scope.events = [{
            title: 'All Day Event',
            start: new Date(y, m, 1)
        }, {
            title: 'Long Event',
            start: new Date(y, m, d - 5),
            end: new Date(y, m, d - 2)
        }, {
            id: 999,
            title: 'Repeating Event',
            start: new Date(y, m, d - 3, 16, 0),
            allDay: false
        }, {
            id: 999,
            title: 'Repeating Event',
            start: new Date(y, m, d + 4, 16, 0),
            allDay: false
        }, {
            title: 'Birthday Party',
            start: new Date(y, m, d + 1, 19, 0),
            end: new Date(y, m, d + 1, 22, 30),
            allDay: false
        }, {
            title: 'Click for Google',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            url: 'http://google.com/'
        }];
        /* event source that calls a function on every view switch */
        $scope.eventsF = function(start, end, timezone, callback) {
            var s = new Date(start).getTime() / 1000;
            var e = new Date(end).getTime() / 1000;
            var m = new Date(start).getMonth();
            var events = [{
                title: 'Feed Me ' + m,
                start: s + (50000),
                end: s + (100000),
                allDay: false,
                className: ['customFeed']
            }];
            callback(events);
        };

        $scope.calEventsExt = {
            color: '#f00',
            textColor: 'yellow',
            events: [{
                type: 'party',
                title: 'Lunch',
                start: new Date(y, m, d, 12, 0),
                end: new Date(y, m, d, 14, 0),
                allDay: false
            }, {
                type: 'party',
                title: 'Lunch 2',
                start: new Date(y, m, d, 12, 0),
                end: new Date(y, m, d, 14, 0),
                allDay: false
            }, {
                type: 'party',
                title: 'Click for Google',
                start: new Date(y, m, 28),
                end: new Date(y, m, 29),
                url: 'http://google.com/'
            }]
        };
        /* alert on eventClick */
        $scope.alertOnEventClick = function(date, jsEvent, view) {
            $scope.alertMessage = (date.title + ' was clicked ');
        };
        /* alert on Drop */
        $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view) {
            $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
        };
        /* alert on Resize */
        $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view) {
            $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
        };
        /* add and removes an event source of choice */
        $scope.addRemoveEventSource = function(sources, source) {
            var canAdd = 0;
            angular.forEach(sources, function(value, key) {
                if (sources[key] === source) {
                    sources.splice(key, 1);
                    canAdd = 1;
                }
            });
            if (canAdd === 0) {
                sources.push(source);
            }
        };
        /* add custom event*/
        $scope.addEvent = function() {
            $scope.events.push({
                title: 'Open Sesame',
                start: new Date(y, m, 28),
                end: new Date(y, m, 29),
                className: ['openSesame']
            });
        };
        /* remove event */
        $scope.remove = function(index) {
            $scope.events.splice(index, 1);
        };
        /* Change View */
        $scope.changeView = function(view, calendar) {
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
        };
        /* Change View */
        $scope.renderCalender = function(calendar) {
            if (uiCalendarConfig.calendars[calendar]) {
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        };
        /* Render Tooltip */
        $scope.eventRender = function(event, element, view) {
            element.attr({
                'tooltip': event.title,
                'tooltip-append-to-body': true
            });
            $compile(element)($scope);
        };
        /* config object */
        $scope.uiConfig = {
            calendar: {
                height: 450,
                editable: true,
                header: {
                    left: 'title',
                    center: '',
                    right: 'today prev,next'
                },
                eventClick: $scope.alertOnEventClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                eventRender: $scope.eventRender
            }
        };

        $scope.changeLang = function() {
            if ($scope.changeTo === 'Hungarian') {
                $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
                $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
                $scope.changeTo = 'English';
            } else {
                $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                $scope.changeTo = 'Hungarian';
            }
        };
        /* event sources array*/
        $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
        $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];


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
                        day: 3,
                        time: new Date(1970, 0, 1, 08, 00, 0)
                    }];
                    $scope.dateOff = [{
                        dateOffStart: new Date(),
                        dateOffEnd: new Date()
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

                Course.insert($scope.coures)
                    .then(
                        function(response) {
                            Course.all().success(function(response) {
                                $scope.courses = response.courses;

                            });
                            notifications.showSuccess({
                                message: 'Add Course successfully.'
                            });
                        },
                        function(response) {
                            console.log(response);
                        });

                
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
                console.log($rootScope.semester.name);

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