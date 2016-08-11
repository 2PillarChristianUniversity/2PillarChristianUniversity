angular.module('smsApp-semesters', ['smsApp-semestersList'])
  .directive('semesterList', function () {
    return {
      restrict: 'E',
      templateUrl: '/templates/semesters/new.html',
      controller: 'SemesterListCtrl'
    };
  });