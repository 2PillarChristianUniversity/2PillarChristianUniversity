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
	'ui.bootstrap',
	'datatables',
	'ngNotificationsBar',
	'ngSanitize'
])
	.config(function ($routeProvider, authProvider, $httpProvider, jwtInterceptorProvider, notificationsConfigProvider) {
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
			// domain: 'pillarseminarysms.auth0.com',
			domain: 'justintong.auth0.com',
			clientID: '4f3JCR8Bp6PpNruh4WSrqGijapKol6m7',
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

		// auto hide
		notificationsConfigProvider.setAutoHide(true);
		// delay before hide
		notificationsConfigProvider.setHideDelay(3000);
		// support HTML
		notificationsConfigProvider.setAcceptHTML(false);
		// Set an animation for hiding the notification
		notificationsConfigProvider.setAutoHideAnimation('fadeOutNotifications');
		// delay between animation and removing the nofitication
		notificationsConfigProvider.setAutoHideAnimationDelay(1200);

	}).run(function ($rootScope, auth, store, jwtHelper, $location, Student) {
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
					// Student.all().success(function(response){
					// 	console.log(response);

					// });
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