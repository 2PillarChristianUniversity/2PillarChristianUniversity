angular.module('smsApp-courses', ['smsApp-coursesList'])
  .directive('courseList', function () {
    return {
      restrict: 'E',
      templateUrl: '/templates/courses/list.html',
      controller: 'CourselistCtrl'
    };
  });