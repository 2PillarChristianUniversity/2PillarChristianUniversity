angular.module('smsApp-coursesList', ['ngRoute'])
  .controller('CourselistCtrl', function ($scope, $location, $uibModal, Course) {
    //  get all list course in db
    Course.all().success(function (response) {
      $scope.courses = response.courses;     
    });

// create course with popup modal 
    $scope.addCourse = function (isCourse) {
      var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'templates/courses/course.html',
          controller: function ($scope, $uibModalInstance, course) { 
            $scope.startDate = new Date();
            $scope.endDate = new Date();
            $scope.startAt =  new Date(2010, 11, 28, 08, 00);
            $scope.endAt =  new Date(2010, 11, 28, 10, 00);
            
            $scope.ok = function () {
              $scope.course = {
                  "name": $scope.name,
                  "startDate": $scope.startDate,
                  "endDate": $scope.endDate,
                  "startAt": $scope.startAt,
                  "endAt": $scope.endAt
                };
              
              $uibModalInstance.close($scope.course);
            }

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

        modalInstance.result.then(function (course) {
            Course.insert(course)
            .then(
            function (response) {
              Course.all().success(function (response) {
                $scope.courses = response.courses;     
              });              
            },
            function (response) {
              console.log(response);
            });

        });
      }

      // edit course 



  });
