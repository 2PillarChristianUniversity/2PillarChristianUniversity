angular.module('smsApp-studentsList')
    .factory("StudentGrade", function StudentGradeFactory($http) {
        return {
            all: function () {
                return $http({ method: "GET", url: "/api/studentGrades" });
            },
            searchID: function (id) {
                return $http({ method: "GET", url: "/api/studentGrades/id/" + id });
            },
            searchName: function (name) {
                return $http({ method: "GET", url: "/api/studentGrades/name/" + name });
            },
            get: function (id) {
                return $http({ method: "GET", url: "/api/studentGrades/id/" + id });
            },
            create: function (studentGrades) {
                return $http({ method: "POST", url: "/api/studentGrades", data: studentGrades });
            }
        };
    });