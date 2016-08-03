angular.module('smsApp', [
	'auth0',
	'ngRoute',
	'ngResource',
	'smsApp-home',
	'smsApp-students',
	'smsApp-professors',
	'smsApp-courses',
	'angular-storage',
	'angular-jwt',
	'ui.bootstrap'
])
	.config(function ($routeProvider, authProvider, $httpProvider, jwtInterceptorProvider) {
		$routeProvider
			.when('/home', {
				controller: 'HomeCtrl',
				templateUrl: 'templates/home.html',
				requiresLogin: true
			})
			.when('/student/:Id', {
				controller: 'StudentDetailsCtrl',
				templateUrl: 'templates/students/details.html',
				requiresLogin: true
			})
			.when('/professor/:Id', {
				controller: 'ProfessorDetailsCtrl',
				templateUrl: 'templates/professors/details.html',
				requiresLogin: true
			})
			.when('/addStudent', {
				controller: 'AddStudentsCtrl',
				templateUrl: 'templates/students/addStudent.html',
				requiresLogin: true
			})
			.when('/addProfessor', {
				controller: 'AddProfessorsCtrl',
				templateUrl: 'templates/professors/addProfessor.html',
				requiresLogin: true
			})
			.when('/students', {
				controller: 'StudentListCtrl',
				templateUrl: 'templates/students/index.html',
				requiresLogin: true
			})
			.when('/courses', {
				controller: 'CourselistCtrl',
				templateUrl: 'templates/courses/index.html',
				requiresLogin: true
			})	
			.when('/professors', {
				controller: 'ProfessorListCtrl',
				templateUrl: 'templates/professors/index.html',
				requiresLogin: true
			})
			.when('/login', {
				controller: 'LoginCtrl',
				templateUrl: 'templates/login.html'
			})
			.when('/:error', {
				controller: 'FailedCtrl',
				templateUrl: 'templates/loginFailed.html'
			})
			.otherwise('/home');

		authProvider.init({
			domain: 'pillarseminarysms.auth0.com',
			clientID: 'lHP3mrqgd5JYC2bnL6tF6w604DtIxjvj',
			loginUrl: '/login'
		});

		authProvider.on('loginSuccess', function ($location, profilePromise, idToken, store) {
			profilePromise.then(function (profile) {
				store.set('profile', profile);
				store.set('token', idToken);
			});
			$location.path('/home');
		});
		authProvider.on('loginFailure', function ($location) {
			$location.path('/error=login%20failure');
		});
		authProvider.on('authenticated', function ($location) {
			console.log("Authenticated");
		});

		jwtInterceptorProvider.tokenGetter = function (store) {
			return store.get('token');
		};

		$httpProvider.interceptors.push('jwtInterceptor');
	}).run(function ($rootScope, auth, store, jwtHelper, $location) {
		$rootScope.$on('$locationChangeStart', function () {
			var token = store.get('token');
			if (token) {
				if (!jwtHelper.isTokenExpired(token)) {
					if (!auth.isAuthenticated) {
						auth.authenticate(store.get('profile'), token);
					}
				} else {
					$location.path('/login');
				}
				if (auth.isAuthenticated) {
					$rootScope.auth = auth;
				}
				console.log(auth);
			}
		});

		$rootScope.logout = function () {
			auth.signout();
			store.remove('profile');
			store.remove('token');
			auth = null;
			window.location = '/';
		};
	});