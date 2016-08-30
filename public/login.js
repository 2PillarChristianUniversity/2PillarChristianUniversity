angular.module('smsApp')
	.controller('LoginCtrl', function ($scope, auth, $rootScope) {
		$scope.auth = auth;

		$scope.lock = new Auth0Lock('4f3JCR8Bp6PpNruh4WSrqGijapKol6m7', 'justintong.auth0.com');
			// $scope.lock = new Auth0Lock('lHP3mrqgd5JYC2bnL6tF6w604DtIxjvj', 'pillarseminarysms.auth0.com');

		$scope.openLogin = function () {
			$scope.lock.showSignin({
				icon: 'assets/images/Pillar_Seminary_logo_small.png',
				connections: ['google-oauth2'],
				dict: {
					signin: {
						title: "Pillar Seminary SMS"
					}
				},
				disableSignupAction: true,
				disableResetAction: true,
				rememberLastLogin: true,
				container: 'widget-container'
			});
		};

		$scope.openLogin();
	})
	.controller('FailedCtrl', function ($scope, $routeParams) {
		$scope.error = $routeParams.error.split('&')[1].split('=')[1].replace(new RegExp('%20', 'g'), ' ');
		console.log($scope.error);
	});