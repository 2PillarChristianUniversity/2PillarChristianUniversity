angular.module('smsApp-coursesList', ['ngRoute', 'ngMaterial'])
  .controller('CourselistCtrl', function ($scope, $location, $uibModal, Course) {
    $scope.myDate = new Date();
    $scope.minDate = new Date(
        $scope.myDate.getFullYear(),
        $scope.myDate.getMonth() - 2,
        $scope.myDate.getDate());
    $scope.maxDate = new Date(
        $scope.myDate.getFullYear(),
        $scope.myDate.getMonth() + 2,
        $scope.myDate.getDate());
    $scope.onlyWeekendsPredicate = function(date) {
      var day = date.getDay();
      return day === 0 || day === 6;
    }

    $scope.showList = function () {
      Course.all().success(function (response){
        $scope.courses = response.courses;
      });

    };

// create course with popup modal 
$scope.addCourse = function (isCourse) {
  var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/courses/course.html',
        controller: function ($scope, $uibModalInstance, course) {      

          $scope.ok = function () {
            $scope.course = {
              "name": $scope.name,
              "startDate": $scope.startDate,
              "endDate": $scope.endDate
            };

            if($scope.name != null && $scope.startDate != null && $scope.endDate != null) {
              Course.insert($scope.course)
              .then(
              function (response) {
                console.log(response);
                $uibModalInstance.close($scope.course);
              },
              function (response) {
                console.log(response);
              });
                  
              
            }            
          };

          $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
          };
        },
        size: 'sm',
        resolve: {
          course: function () {
            return $scope.course;
          }
        }
      });
}


  });
