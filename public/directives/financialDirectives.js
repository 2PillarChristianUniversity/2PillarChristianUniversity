angular.module('smsApp-financials', ['smsApp-financialsList'])
  .directive('financialList', function () {
    return {
      restrict: 'E',
      templateUrl: '/templates/financials/list.html',
      controller: 'FinancialListCtrl'
    };
  });