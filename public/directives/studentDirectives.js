angular.module('smsApp-students', ['smsApp-studentsList'])
  .directive('studentList', function () {
    return {
      restrict: 'E',
      templateUrl: '/templates/students/list.html',
      controller: 'StudentListCtrl'
    };
  })
  .directive("formatDate", function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attr, modelCtrl) {
        modelCtrl.$formatters.push(function (modelValue) {
          return new Date(modelValue);
        })
      }
    }
  });