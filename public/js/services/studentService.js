angular.module('smsApp-studentsList')
    .factory("Student", function StudentFactory($http   ) {
        return {
            all: function () {
                return $http({ method: "GET", url: "/api/students" });
            },
            searchID: function (id) {
                return $http({ method: "GET", url: "/api/students/id/" + id });
            },
            searchName: function (name) {
                return $http({ method: "GET", url: "/api/students/name/" + name });
            },
            get: function (id) {
                return $http({ method: "GET", url: "/api/student/id/" + id });
            },
            getStudentByEmail: function (email) {
                return $http({ method: "GET", url: "/api/student/email/" + email });
            },
            update: function (id, student) {
                return $http({ method: "POST", url: "/api/student/id/" + id, data: student });
            },
            insert: function (student) {
                return $http({method: "PUT", url: "/api/student", data: student });
            },
            delete: function (id) {
                return $http({ method: "DELETE", url: "/api/student/id/" + id });
            }
        };
    });