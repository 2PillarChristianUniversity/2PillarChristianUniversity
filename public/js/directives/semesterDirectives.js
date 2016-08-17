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
    });