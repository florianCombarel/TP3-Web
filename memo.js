AppMemory.
directive('memory', function(){
  return {
    templateUrl: 'memo.html',
    controller: function($scope, $http) {
      function numeroAleatoire(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
      }
      function melange(tableau) {
        var indexCourant = tableau.length, valTempo, indexAlea;

        while (0 !== indexCourant) {

          indexAlea = Math.floor(Math.random() * indexCourant);
          indexCourant -= 1;

          valTempo = tableau[indexCourant];
          tableau[indexCourant] = tableau[indexAlea];
          tableau[indexAlea] = valTempo;
        }

        return tableau;
      }

      $scope.loading = false;
      $scope.jeu = function(){
        $scope.loading = true;
        var json = $http.get("champions.json");
        json.then(function(data){
          var cartes = [];
          var champions = data.data.data;
          var nomChampions = Object.keys(champions);
          for(var i = 0; i < 3; i++){
            var id = numeroAleatoire(0, nomChampions.length-1);
            var urlChampion = { nom: nomChampions[id], url:"https://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+nomChampions[id]+"_0.jpg"};
            if(cartes.indexOf(urlChampion) == -1){
              cartes.push(urlChampion);
              cartes.push({ nom: nomChampions[id], url:"https://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+nomChampions[id]+"_1.jpg"});
            }
            else{
              i--;
            }
          }
          $scope.cartes = melange(cartes);
          $scope.loading = false;
        });
      };
    }
  };
});
