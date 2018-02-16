 AppMemory.
  directive('memory', function(){
     return {
      templateUrl: './views/memo.html',
      controller: function($scope, $rootScope, $http, $timeout) {
        function randomIntFromInterval(min,max){
            return Math.floor(Math.random()*(max-min+1)+min);
        }
        function shuffle(array) {
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
          nbCards : 3
        };

        $scope.startGame = function(){
          $scope.loading = true;
          var promise = $http.get("champions.json");
          promise.then(function(data){
            var cards = [];
            var champs = data.data.data;
            var champsName = Object.keys(champs);
            console.log("TEST NB CARDS : ", $scope.config.nbCards);
            for(var i = 0; i < $scope.config.nbCards; i++){
              var id = randomIntFromInterval(0, champsName.length-1);
              console.log(id, champsName[id]);
              //TODO select 2 from skins
              var champUrl = { name: champsName[id], url:"https://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+champsName[id]+"_0.jpg", founded: false, clicked: false};
              if(cards.indexOf(champUrl) == -1){
                cards.push(champUrl);
                cards.push({ name: champsName[id], url:"https://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+champsName[id]+"_1.jpg", skin: true, founded: false, clicked: false});
              }
              else{
                i--;
              }
            }
            $scope.cards = shuffle(cards);
            $scope.loading = false;
          });
        };

        $scope.checkIfWin = function(){
          var win = true;
          var i = 0;
          while(win && i < $scope.cards.length){
            win = $scope.cards[i].matched;
            i++;
          }
          if(win){
            alert("Youpi ! ");
            $scope.cards = null;

          }
        };


        $scope.check = function(){
          console.log("Check if double matched", $scope.cards);
          var card1 = null;
          var card2 = null;
          for(var cardId in $scope.cards){
            var card = $scope.cards[cardId];
            if(card.clicked && !card.matched){
              if(card1 == null){
                card1 = card;
              }
              else{
                card2 = card;
              }
            }
          }
          if(card1 != null && card2 != null){
            $rootScope.avoidCardClick = true;
            $timeout(function(){
              if(card1.name == card2.name){
                card1.matched = true;
                card2.matched = true;
              }
              $timeout(function(){
                $scope.checkIfWin();
                for(var cardId in $scope.cards){
                  var card = $scope.cards[cardId];
                  card.clicked = false;
                }
                $rootScope.avoidCardClick = false;;
              }, 500);
            }, 1000);
          }
        };

      }
     };
  });
