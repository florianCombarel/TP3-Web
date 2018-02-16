 AppMemory.
 directive('carte', function() {
  return {
    restrict: 'E',
    scope: {
      carte: '=',
      check: '&'
    },
    templateUrl: 'views/carte.html',
    controller: function($scope, $rootScope){

      $scope.clickSurCarte = function(){
        if(!$rootScope.annulerClick){
          $scope.carte.clicked = !$scope.carte.clicked;
          if($scope.carte.clicked){
            $scope.check().apply();
          }
        }
      };
    }
  };
});
