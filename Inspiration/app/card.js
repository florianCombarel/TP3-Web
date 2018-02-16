 AppMemory.
 directive('carte', function() {
  return {
    restrict: 'E',
    scope: {
      carte: '=',
      check: '&'
    },
    templateUrl: 'views/card.html',
    controller: function($scope, $rootScope){

      $scope.clickSurCarte = function(){
        if(!$rootScope.annulerClick){
          $scope.carte.clicked = !$scope.card.clicked;
          if($scope.card.clicked){
            $scope.check().apply();
          }
        }
      };
    }
  };
});
