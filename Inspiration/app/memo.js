AppMemory.
directive('memory', function(){
  return {
    templateUrl: './views/memo.html',
    controller: function($scope, $rootScope, $http, $timeout) {
      function numeroAleatoireChampion(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
      }
      function melange(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {

          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }

        return array;
      }

      $scope.loading = false;
      $scope.config = {
        nbcartes : 3
      };

      $scope.startGame = function(){
        $scope.loading = true;
        var promise = $http.get("champions.json");
        promise.then(function(data){
          var cartes = [];
          var champs = data.data.data;
          var champsName = Object.keys(champs);
          for(var i = 0; i < $scope.config.nbcartes; i++){
            var id = randomIntFromInterval(0, champsName.length-1);
            console.log(id, champsName[id]);
            var champUrl = { name: champsName[id], url:"https://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+champsName[id]+"_0.jpg", founded: false, clicked: false};
            if(cartes.indexOf(champUrl) == -1){
              cartes.push(champUrl);
              cartes.push({ name: champsName[id], url:"https://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+champsName[id]+"_1.jpg", skin: true, founded: false, clicked: false});
            }
            else{
              i--;
            }
          }
          $scope.cartes = melange(cartes);
          $scope.loading = false;
        });
      };

      $scope.checkIfWin = function(){
        var win = true;
        var i = 0;
        while(win && i < $scope.cartes.length){
          win = $scope.cartes[i].matched;
          i++;
        }
        if(win){
          alert("Youpi ! ");
          $scope.cartes = null;

        }
      };


      $scope.check = function(){
        console.log("Check if double matched", $scope.cartes);
        var carte1 = null;
        var carte2 = null;
        for(var carteId in $scope.cartes){
          var carte = $scope.cartes[carteId];
          if(carte.clicked && !carte.matched){
            if(carte1 == null){
              carte1 = carte;
            }
            else{
              carte2 = carte;
            }
          }
        }
        if(carte1 != null && carte2 != null){
          $rootScope.avoidcarteClick = true;
          $timeout(function(){
            if(carte1.name == carte2.name){
              carte1.matched = true;
              carte2.matched = true;
            }
            $timeout(function(){
              $scope.checkIfWin();
              for(var carteId in $scope.cartes){
                var carte = $scope.cartes[carteId];
                carte.clicked = false;
              }
              $rootScope.avoidcarteClick = false;;
            }, 500);
          }, 1000);
        }
      };

    }
  };
});
