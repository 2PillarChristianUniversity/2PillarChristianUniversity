angular.module('smsApp-professors', ['smsApp-professorsList'])
  .directive('professorList', function () {
    return {
      restrict: 'E',
      templateUrl: '/templates/professors/list.html',
      controller: 'ProfessorListCtrl'
    };
  });