angular.module('smsApp-studentsList')
    .factory("Grade", function GradeFactory($http) {
        return {
            all: function () {
                return $http({ method: "GET", url: "/api/grades" });
            },
            searchID: function (id) {
                return $http({ method: "GET", url: "/api/grades/id/" + id });
            },
            searchName: function (name) {
                return $http({ method: "GET", url: "/api/grades/name/" + name });
            },
            get: function (id) {
                return $http({ method: "GET", url: "/api/grade/id/" + id });
            },
            getStudentCourse: function (ids) {
                return $http({ method: "POST", url: "/api/grade/studentCourses", data: ids });
            },
            update: function (id, grade) {
                return $http({ method: "POST", url: "/api/grade/id/" + id, data: grade });
            },
            create: function (grade) {
                return $http({ method: "PUT", url: "/api/grade", data: grade });
            },
            getStudent: function (id) {
                return $http({ method: "GET", url: "/api/grade/student/" + id });
            }
        };
    });
