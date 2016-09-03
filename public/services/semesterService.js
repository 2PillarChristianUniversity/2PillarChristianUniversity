angular.module('smsApp-semestersList')
    .factory("Semester", function CourseFactory($http) {
        return {
            all: function () {
                return $http({ method: "GET", url: "/api/semesters" });
            },
            searchID: function (id) {
                return $http({ method: "GET", url: "/api/semester/id/" + id });
            },
            searchName: function (name) {
                return $http({ method: "GET", url: "/api/semesters/name/" + name });
            },
            get: function (id) {
                return $http({ method: "GET", url: "/api/semester/id/" + id });
            },
            update: function (id, semester) {
                return $http({ method: "POST", url: "/api/semester/id/" + id, data: semester });
            },
            create: function (semester) {
                return $http({ method: "PUT", url: "/api/semester", data: semester });
            },
            delete: function (id) {
                return $http({method: "DELETE", url: "/api/semester/id/" + id });
            },
            getTreeList: function () {
                return $http({ method: "GET", url: "/api/treelist" });
            },
            getTreeListByProfessor: function (professorId) {
                return $http({ method: "GET", url: "/api/treelist/id/" + professorId });
            }
        };
    });
