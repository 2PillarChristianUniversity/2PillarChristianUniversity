angular.module('smsApp-home', ['auth0'])
	.controller('HomeCtrl', function ($scope, auth, $http, $location, store, $rootScope) {
		$scope.auth = auth;
		$scope.callApi = function () {
			$http({
				url: 'http://localhost:3000/api/secured/ping',
				method: 'GET'
			})
				.then(function () {
					alert("We got the secured data successfully");
				}, function (response) {
					if (response.status == -1) {
						alert("Please download the API seed so that you can call it.");
					} else {
						alert(response.data);
					}
				});
		};
	});