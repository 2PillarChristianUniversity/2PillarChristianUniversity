angular.module('smsApp')
	.controller('LoginCtrl', function ($scope, auth, $rootScope) {
		$scope.auth = auth;

		$scope.lock = new Auth0Lock('lHP3mrqgd5JYC2bnL6tF6w604DtIxjvj', 'pillarseminarysms.auth0.com');

		$scope.openLogin = function () {
			$scope.lock.showSignin({
				icon: '/img/Pillar_Seminary_logo_small.png',
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