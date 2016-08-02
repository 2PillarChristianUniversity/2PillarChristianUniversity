angular.module('smsApp-coursesList', ['ngRoute'])
  .controller('CourselistCtrl', function ($scope, $location, $uibModal, Course) {
    //  get all list course in db

    Course.all().success(function (response) {
      $scope.courses = response.courses;
     
    });

    $scope.addCourse = function (isCourse) {
      var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/courses/course.html',
            controller: function ($scope, $uibModalInstance, Course) {      
              
              // var lnt = $scope.courses.lenght + 1;
              $scope.ok = function () {
                console.log($scope.courses);
                $scope.course = {
                  "_id": '',
                  "name": $scope.name,
                  "startDate": $scope.startDate,
                  "endDate": $scope.endDate
                };

                if($scope.name != null && $scope.startDate != null && $scope.endDate != null) {
                  Course.insert($scope.course)
                  .then(
                  function (response) {
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
