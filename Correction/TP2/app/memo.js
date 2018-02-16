 MemoApp.
  directive('memo', function(){
     return {
      templateUrl: './views/memo.html',
      controller: function($scope, $rootScope, $http, $timeout) {
        function randomIntFromInterval(min,max){
            return Math.floor(Math.random()*(max-min+1)+min);
        }
        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

              // Pick a remaining element...
              randomIndex = Math.floor(Math.random() * currentIndex);
              currentIndex -= 1;

              // And swap it with the current element.
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
          var promise = $http.get("https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion?champData=skins,stats&api_key=RGAPI-139c58fe-7f0a-492e-a7dc-b640b9ba406e");
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
            // $scope.cards = [
            //   {
            //     name: "Ivern",
            //     url: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ivern_0.jpg"
            //   },
            //   {
            //     name: "Ivern",
            //     url: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ivern_1.jpg",
            //     skin: true
            //   },
            //   {
            //     name: "Teemo",
            //     url: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Teemo_0.jpg"
            //   },
            //   {
            //     name: "Teemo",
            //     url: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Teemo_1.jpg",
            //     skin: true
            //   },
            //   {
            //     name: "Taric",
            //     url: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Taric_0.jpg"
            //   },
            //   {
            //     name: "Taric",
            //     url: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Taric_1.jpg",
            //     skin: true
            //   }
            // ];
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
            alert("Vous avez gagné !! ");
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