angular.module('smsApp-institutions', ['smsApp-institutionsList'])
  .directive('institutionList', function () {
    return {
      restrict: 'E',
      templateUrl: '/templates/institutions/list.html',
      controller: 'InstitutionListCtrl'
    };
  });