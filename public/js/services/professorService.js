angular.module('smsApp-studentsList')
    .factory("Professor", function ProfessorFactory($http) {
        return {
            all: function () {
                return $http({ method: "GET", url: "/api/professors" });
            },
            searchID: function (id) {
                return $http({ method: "GET", url: "/api/professors/id/" + id });
            },
            searchName: function (name) {
                return $http({ method: "GET", url: "/api/professors/name/" + name });
            },
            get: function (id) {
                return $http({ method: "GET", url: "/api/professor/id/" + id });
            },
            create: function (professor) {
                return $http({ method: "POST", url: "/api/professor", data: professor });
            },
            insert: function (professor) {
                return $http({ method: "PUT", url: "/api/professor", data: professor });
            },
            delete: function (professor) {
                return $http({ method: "DELETE", url: "/api/professor", data: professor });
            }
        };
    });