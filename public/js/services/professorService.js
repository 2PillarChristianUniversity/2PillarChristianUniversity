//  this is a modul hadle Call API for professor 
angular.module('smsApp-professors')
    .factory("Professor", function ProfessorFactory($http) {
        return {
          
            // all: function () {
            //     return $http({ method: "GET", url: "/api/students" });
            // }
            // searchID: function (id) {
            //     return $http({ method: "GET", url: "/api/students/id/" + id });
            // },
            // searchName: function (name) {
            //     return $http({ method: "GET", url: "/api/students/name/" + name });
            // },
            // get: function (id) {
            //     return $http({ method: "GET", url: "/api/student/id/" + id });
            // },
            // create: function (id, student) {
            //     return $http({ method: "POST", url: "/api/student/id/" + id, data: student });
            // },
            // insert: function (student) {
            //     return $http({method: "PUT", url: "/api/student", data: student });
            // }
        };
    });