angular.module('smsApp', [
	'auth0',
	'ngRoute',
	'ngResource',
	'smsApp-home',
	'smsApp-students',
	'smsApp-professors',
	'smsApp-courses',
	'smsApp-semesters',
	'smsApp-institutions',
	'smsApp-financials',
	'angular-storage',
	'angular-jwt',
	'ui.bootstrap',
	'datatables',
	'ngNotificationsBar',
	'ngSanitize',
	'ui.calendar',
	'ngSecurity'
])

.config(function($routeProvider, authProvider, $httpProvider, jwtInterceptorProvider,
	notificationsConfigProvider) {

	$httpProvider.interceptors.push('$securityInterceptor');

	$routeProvider
		.when('/home', {
			controller: 'HomeCtrl',
			templateUrl: 'templates/home.html',
			requiresLogin: true
		})

	//######## STUDENT
	.when('/student/:Id', {
			controller: 'StudentDetailsCtrl',
			templateUrl: 'templates/students/details.html',
			requiresLogin: true
		})
		.when('/addStudent', {
			controller: 'AddStudentsCtrl',
			templateUrl: 'templates/students/addStudent.html',
			requiresLogin: true
		})
		.when('/students', {
			controller: 'StudentListCtrl',
			templateUrl: 'templates/students/index.html',
			requiresLogin: true
		})
		.when('/studentProfile', {
			controller: 'StudentDetailsCtrl',
			templateUrl: 'templates/students/profile.html',
			requiresLogin: true
		})

	//######## PROFESSOR
		.when('/professors', {
			controller: 'ProfessorListCtrl',
			templateUrl: 'templates/professors/index.html',
			requiresLogin: true
		})
		.when('/professor/:Id', {
			controller: 'ProfessorDetailsCtrl',
			templateUrl: 'templates/professors/details.html',
			requiresLogin: true
		})
		.when('/addProfessor', {
			controller: 'AddProfessorsCtrl',
			templateUrl: 'templates/professors/addProfessor.html',
			requiresLogin: true
		})
		.when('/professorProfile', {
			controller: 'ProfessorDetailsCtrl',
			templateUrl: 'templates/professors/profile.html',
			requiresLogin: true
		})

	//######## INSTITUTION
	.when('/institutions', {
			controller: 'InstitutionListCtrl',
			templateUrl: 'templates/institutions/index.html',
			requiresLogin: true
		})
		.when('/institution/:Id', {
			controller: 'InstitutionDetailsCtrl',
			templateUrl: 'templates/institutions/details.html',
			requiresLogin: true
		})

	//######## SEMESTER
	.when('/semesters', {
		controller: 'SemesterListCtrl',
		templateUrl: 'templates/semesters/index.html',
		requiresLogin: true
	})

	//######## FINANCIAL
	.when('/financials', {
		controller: 'FinancialListCtrl',
		templateUrl: 'templates/financials/index.html',
		requiresLogin: true
	})

	//######## LOGIN
	.when('/login', {
		controller: 'LoginCtrl',
		templateUrl: 'templates/login.html'
	})

	//######## OTHERS
	.when('/:error', {
			controller: 'FailedCtrl',
			templateUrl: 'templates/loginFailed.html'
		})
		.otherwise('/home');

	authProvider.init({
		domain: auth0Cfg.domain,
		clientID: auth0Cfg.clientID,
		loginUrl: auth0Cfg.loginUrl
	});

	authProvider.on('loginSuccess', function($location, profilePromise, idToken, store, $security, Student, Professor, $rootScope) {
		profilePromise.then(function(profile) {
			//	Check role
			var roles = [];
			store.set('token', idToken);
			Student.getStudentByEmail(profile.email).success(function(response) {
				if (response.student != null) {
					roles.push('Student');
					store.set('studentID', response.student._id);
					profile = angular.extend(profile, response.student);
					$security.login(idToken, profile, roles);
					$location.path('/home');
				} else {
					Professor.getProfessorByEmail(profile.email).success(function(response) {
						if (response.professor != null) {
							roles.push('Professor');
							store.set('professorID', response.professor._id);
							profile = angular.extend(profile, response.professor);

							$security.login(idToken, profile, roles);
							$location.path('/home');
						} else {
							roles.push('Admin');
							$security.login(idToken, profile, roles);
							$location.path('/home');
						}
					});
				}
			});
		});
	});

	authProvider.on('loginFailure', function($location) {
		$location.path('/error=login%20failure');
	});
	authProvider.on('authenticated', function($location) {
		console.log("Authenticated");
	});

	jwtInterceptorProvider.tokenGetter = function(store) {
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

}).run(function($rootScope, auth, store, jwtHelper, $location, Student, $security) {
	$rootScope.security = $security;
	$rootScope.$on('unauthenticated', function() {
		alert('redirect to login');
	});
	$rootScope.$on('permissionDenied', function() {
		alert('redirect to permission denied');
	});
	$rootScope.$on('$locationChangeStart', function() {
		var token = store.get('token');
		if (token) {
			if (!jwtHelper.isTokenExpired(token)) {
				if (!auth.isAuthenticated) {
					auth.authenticate($security.getUser(), token);
				}
			} else {
				$location.path('/login');
			}
			if (auth.isAuthenticated) {
				$rootScope.auth = auth;
			}
		} else {
			$location.path('/login');
		}

	});

	$rootScope.logout = function() {
		auth.signout();
		store.set('token', null);
		$security.logout();
		auth = null;
		window.location = '/';
	};
});
