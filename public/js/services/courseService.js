angular.module('smsApp-studentsList')
    .factory("Course", function CourseFactory($http) {
        return {
            all: function () {
                return $http({ method: "GET", url: "/api/courses" });
            },
            searchID: function (id) {
                return $http({ method: "GET", url: "/api/courses/id/" + id });
            },
            searchName: function (name) {
                return $http({ method: "GET", url: "/api/courses/name/" + name });
            },
            get: function (id) {
                return $http({ method: "GET", url: "/api/course/id/" + id });
            },
            create: function (course) {
                return $http({ method: "POST", url: "/api/course", data: course });
            },
            insert: function (course) {
                return $http({ method: "PUT", url: "/api/course", data: course });
            },
            delete: function (id) {
                return $http({method: "DELETE", url: "/api/course/id/" + id });
            }


        };
    });