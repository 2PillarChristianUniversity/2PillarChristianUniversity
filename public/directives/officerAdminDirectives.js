angular.module('smsApp-officerAdmins', ['smsApp-officerAdminsList'])
  .directive('officerAdminList', function () {
    return {
      restrict: 'E',
      templateUrl: '/templates/officerAdmins/list.html',
      controller: 'OfficerAdminListCtrl'
    };
  });