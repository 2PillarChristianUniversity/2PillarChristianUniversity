angular.module('smsApp-studentsList')
    .factory("Institution", function InstitutionFactory($http) {
        return {
            all: function () {
                return $http({ method: "GET", url: "/api/institutions" });
            },
            searchID: function (id) {
                return $http({ method: "GET", url: "/api/institutions/id/" + id });
            },
            searchName: function (name) {
                return $http({ method: "GET", url: "/api/institutions/name/" + name });
            },
            get: function (id) {
                return $http({ method: "GET", url: "/api/institution/id/" + id });
            },
            create: function (institution) {
                return $http({ method: "POST", url: "/api/institution", data: institution });
            }
        };
    });