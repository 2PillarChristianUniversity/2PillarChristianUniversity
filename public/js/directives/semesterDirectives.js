angular.module('smsApp-semesters', ['smsApp-semestersList'])
    .directive('semesterList', function() {
        return {
            restrict: 'E',
            templateUrl: '/templates/semesters/new.html',
            controller: 'SemesterListCtrl'
        };
    })
    .directive('semesterTreeview', function() {
        return {
            restrict: 'E',
            templateUrl: '/templates/semesters/semesterTreeview.html',
            controller: 'SemesterTreeviewCtrl'
        };
    })
    .directive('slideToggle', function() {
        return {
            restrict: 'A',
            scope: {
                isOpen: "=slideToggle" // 'data-slide-toggle' in our html
            },
            link: function(scope, element, attr) {
                var slideDuration = parseInt(attr.slideToggleDuration, 10) || 200;

                // Watch for when the value bound to isOpen changes
                // When it changes trigger a slideToggle
                scope.$watch('isOpen', function(newIsOpenVal, oldIsOpenVal) {
                    if (newIsOpenVal !== oldIsOpenVal) {
                        element.stop().slideToggle(slideDuration);
                    }
                });

            }
        };
    });