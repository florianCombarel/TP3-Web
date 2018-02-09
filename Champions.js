angular.module('data', [])
.controller('Champions', ["$scope", "$http", function($scope, $http) {
    $http.get('Access-Control-Allow-Origin: https://euw1.api.riotgames.com/lol/static-data/v3/champions?api_key=RGAPI-f9c233d4-31fd-45fd-a095-5990764b03c4')
        .then(function(response) {
            $scope.champions = response.data;
        });
}]);