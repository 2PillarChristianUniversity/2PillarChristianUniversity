angular.module('smsApp-studentsList')
    .factory("Ministry", function MinistryFactory($http) {
        return {
            all: function () {
                return $http({ method: "GET", url: "/api/ministries" });
            },
            searchID: function (id) {
                return $http({ method: "GET", url: "/api/ministries/id/" + id });
            },
            searchName: function (name) {
                return $http({ method: "GET", url: "/api/ministries/name/" + name });
            },
            get: function (id) {
                return $http({ method: "GET", url: "/api/ministry/id/" + id });
            },
            create: function (ministry) {
                return $http({ method: "POST", url: "/api/ministry", data: ministry });
            }
        };
    });