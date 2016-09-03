angular.module('smsApp-studentsList')
    .factory("AdminService", function StudentFactory($http   ) {
        return {
            getAdminByEmail: function (email) {
                return $http({ method: "GET", url: "/api/admin/email/" + email });
            }
        };
    });
