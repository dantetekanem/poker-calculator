window.assignText = function(log) {
  var li = $("<li />").text(log);
  $("#text-table").append(li);
}

window.runGame = function(players) {
  PokerCalculator.resetGame();
  var yourHand = PokerCalculator.randomHand();
  var playersHands = PokerCalculator.randomHands(players);
  var flop = PokerCalculator.randomFlop();

  assignText("YOUR HAND");
  assignText(yourHand);
  assignText("PLAYERS HANDS");
  for (var i = 0; i < playersHands.length; ++i) {
    assignText(playersHands[i]);
  }

  assignText("FLOP");
  assignText(flop);

  assignText("RUNNING GAME...")

  var player;
  var finalTable = {};
  for (var i = 0; i < playersHands.length; ++i) {
    player = playersHands[i];
    points = PokerCalculator.calculateGame(player, flop);
    finalTable["player-"+(i+1)] = { hand: player, points: points };

    assignText("PLAYER "+(i+1)+" ["+player.join(", ")+"] MADE "+points+" POINTS");

    if (points < 100) {
      assignText("ONLY HIGH CARDS");
    } else if(points < 200) {
      assignText("PAIR");
    } else if(points < 300) {
      assignText("TWO PAIRS");
    } else if(points < 400) {
      assignText("THREE OF A KIND");
    } else if(points < 500) {
      assignText("STRAIGHT");
    } else if(points < 600) {
      assignText("FLUSH");
    } else if(points < 700) {
      assignText("FULL HOUSE");
    } else if(points < 800) {
      assignText("FOUR OF A KIND");
    } else if(points < 900) {
      assignText("STRAIGHT FLUSH");
    } else if(points < 1000) {
      assignText("ROYAL FLUSH");
    }
  }

  assignText("BEST HAND");
  var hands = PokerCalculator.sortBestHands();
  var bestHand = PokerCalculator.bestHand(hands);
  assignText(bestHand.cards.join(", "));
  assignText("WINS WITH: "+bestHand.points+" POINTS");
}

window.simulateAmountOfVictories = function() {
  var cardOne = $("#game-card-one").val();
  var cardTwo = $("#game-card-two").val();
  var amountOfGames = parseInt($("#game-amount-of-games").val());
  var players = parseInt($("#game-players").val());
  var yourHand = cardOne+"-"+cardTwo;

  var amountOfVictories = 0, bestHands, bestHand;
  for (var i = 0; i < amountOfGames; ++i) {
    PokerCalculator.resetGame();
    PokerCalculator.addHand(cardOne, cardTwo);
    PokerCalculator.randomHands(players);
    PokerCalculator.randomFlop();
    bestHands = PokerCalculator.sortBestHands();
    bestHand = PokerCalculator.bestHand(bestHands);
    bestHandSideOne = bestHand.cards[0]+"-"+bestHand.cards[1];
    bestHandSideTwo = bestHand.cards[1]+"-"+bestHand.cards[0];

    if(yourHand == bestHandSideOne || yourHand == bestHandSideTwo) {
      amountOfVictories++;
    }
  }

  alert("In a total of "+amountOfGames+" games, your hand "+cardOne+" - "+cardTwo+" have won "+amountOfVictories+" times.");
}
