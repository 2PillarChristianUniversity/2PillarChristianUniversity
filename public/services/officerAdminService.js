angular.module('smsApp-officerAdminsList')
    .factory("OfficerAdmin", function OfficerAdminFactory($http) {
        return {
            all: function () {
                return $http({ method: "GET", url: "/api/officerAdmins" });
            },
            searchID: function (id) {
                return $http({ method: "GET", url: "/api/officerAdmins/id/" + id });
            },
            searchName: function (name) {
                return $http({ method: "GET", url: "/api/officerAdmins/name/" + name });
            },
            get: function (id) {
                return $http({ method: "GET", url: "/api/officerAdmin/id/" + id });
            },
            update: function (id, officerAdmin) {
                return $http({ method: "POST", url: "/api/officerAdmin/id/" + id, data: officerAdmin });
            },
            insert: function (officerAdmin) {
                return $http({ method: "PUT", url: "/api/officerAdmin", data: officerAdmin });
            },
            delete: function (id) {
                return $http({ method: "DELETE", url: "/api/officerAdmin/id/" + id });
            },           
        };
    });