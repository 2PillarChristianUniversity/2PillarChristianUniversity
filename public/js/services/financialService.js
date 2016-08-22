angular.module('smsApp-studentsList')
    .factory("Financial", function FinancialFactory($http) {
        return {
            all: function () {
                return $http({ method: "GET", url: "/api/financials" });
            },
            searchID: function (id) {
                return $http({ method: "GET", url: "/api/financials/id/" + id });
            },
            searchName: function (name) {
                return $http({ method: "GET", url: "/api/financials/name/" + name });
            },
            get: function (id) {
                return $http({ method: "GET", url: "/api/financial/id/" + id });
            },
            update: function (id, financial) {
                return $http({ method: "POST", url: "/api/financial/id/" + id, data: financial });
            },
            insert: function (financial) {
                return $http({method: "PUT", url: "/api/financial", data: financial });
            },
            delete: function (id) {
                return $http({ method: "DELETE", url: "/api/financial/id/" + id });
            }
        };
    });