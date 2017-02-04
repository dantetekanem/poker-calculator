function containsAll(needles, haystack){
  for(var i = 0 , len = needles.length; i < len; i++){
     if($.inArray(needles[i], haystack) == -1) return false;
  }
  return true;
}

var PokerCalculator = function() {
  this.cards = {
    // Copas
    heart: [
      'H:2', 'H:3', 'H:4', 'H:5', 'H:6', 'H:7', 'H:8', 'H:9', 'H:10', 'H:J', 'H:Q', 'H:K', 'H:A'
    ],
    // Ouros
    diamond: [
      'D:2', 'D:3', 'D:4', 'D:5', 'D:6', 'D:7', 'D:8', 'D:9', 'D:10', 'D:J', 'D:Q', 'D:K', 'D:A'
    ],
    // Paus
    club: [
      'C:2', 'C:3', 'C:4', 'C:5', 'C:6', 'C:7', 'C:8', 'C:9', 'C:10', 'C:J', 'C:Q', 'C:K', 'C:A'
    ],
    // Espadas
    spade: [
      'S:2', 'S:3', 'S:4', 'S:5', 'S:6', 'S:7', 'S:8', 'S:9', 'S:10', 'S:J', 'S:Q', 'S:K', 'S:A'
    ]
  };
  this.allCards = this.cards.heart.concat(this.cards.diamond).concat(this.cards.club).concat(this.cards.spade);
  this.cardsPoints = {
    "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "10": 9, "J": 10, "Q": 11, "K": 12, "A": 13
  };
  this.resetGame();
}

PokerCalculator.prototype.resetGame = function() {
  this.hands = [];
  this.flop = [];
  this.currentCards = [];
  for(prop in this.allCards) {
    if(this.allCards.hasOwnProperty(prop)) {
      this.currentCards[prop] = this.allCards[prop];
    }
  }
}

PokerCalculator.prototype.cardToPoint = function(card) {
  return this.cardsPoints[card.toString().split(":")[1]];
}

PokerCalculator.prototype.compareRank = function(aOrigin, bOrigin) {
  var cardsPoints = {
    "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "10": 9, "J": 10, "Q": 11, "K": 12, "A": 13
  };
  var a = cardsPoints[aOrigin.toString().split(":")[1]];
  var b = cardsPoints[bOrigin.toString().split(":")[1]];

  return a < b ? -1 : 1;
}

PokerCalculator.prototype.getCard = function() {
  var index = Math.floor(Math.random() * this.currentCards.length);
  var card = this.currentCards[index];
  this.currentCards.splice(index, 1);

  return card;
}

PokerCalculator.prototype.removeCard = function(card) {
  var index = this.currentCards.indexOf(card);
  this.currentCards.splice(index, 1);
}

PokerCalculator.prototype.addHand = function(card_one, card_two) {
  var hand = [card_one, card_two];
  this.removeCard(card_one);
  this.removeCard(card_two);

  this.hands.push(hand);
}

PokerCalculator.prototype.calculateGame = function(hand, cards) {
  var gameCards = hand.concat(cards);

  // Royal Flush
  if (this.RoyalFlush(gameCards)) {
    return 900 + this.HighCard(hand);
  }

  // Straight Flush
  if (this.StraightFlush(gameCards)) {
    return 800 + this.HighCard(hand);
  }

  // Four of a Kind
  if (this.FourOfAKind(gameCards)) {
    return 700 + this.HighCard(hand);
  }

  // Full House
  if (this.FullHouse(gameCards)) {
    return 600 + this.HighCard(hand);
  }

  // Flush
  if (this.Flush(gameCards).length > 0) {
    return 500 + this.HighCard(hand);
  }

  // Straight
  if (this.Straight(gameCards)) {
    return 400 + this.HighCard(hand);
  }

  // Three of a Kind
  if (this.ThreeOfAKind(gameCards).length > 0) {
    return 300 + this.HighCard(hand);
  }

  // Two Pair
  if (this.TwoPair(gameCards)) {
    return 200 + this.HighCard(hand);
  }

  // Pair
  if (this.Pair(gameCards)) {
    return 100 + this.HighCard(hand);
  }

  // High Card (13 max)
  return this.HighCard(hand);
};

PokerCalculator.prototype.RoyalFlush = function(cards) {
  var royalFlush = false;

  if(containsAll(cards, ["H:10", "H:J", "H:Q", "H:K", "H:A"])) {
    royalFlush = true;
  }
  if(containsAll(cards, ["D:10", "D:J", "D:Q", "D:K", "D:A"])) {
    royalFlush = true;
  }
  if(containsAll(cards, ["C:10", "C:J", "C:Q", "C:K", "C:A"])) {
    royalFlush = true;
  }
  if(containsAll(cards, ["S:10", "S:J", "S:Q", "S:K", "S:A"])) {
    royalFlush = true;
  }

  return royalFlush;
}

PokerCalculator.prototype.StraightFlush = function(cards) {
  var flush = this.Flush(cards), card, index;
  if (flush.length == 0) {
    return false;
  }

  return this.Straight(flush);
}

PokerCalculator.prototype.FourOfAKind = function(cards) {
  var four = false, comparingCards = [], card, blockOfCards;

  for (var i = 0; i < cards.length; ++i) {
    card = cards[i];
    cardSplitted = card.toString().split(":");
    if (!comparingCards[cardSplitted[1]]) {
      comparingCards[cardSplitted[1]] = [];
    }
    comparingCards[cardSplitted[1]].push(card[0]);
  }

  for (key in comparingCards) {
    blockOfCards = comparingCards[key];
    if (blockOfCards.length >= 4) {
      four = true;
      break;
    }
  }

  return four;
}

PokerCalculator.prototype.FullHouse = function(cards) {
  var threeOfAKind = this.ThreeOfAKind(cards), card, index;
  if (threeOfAKind.length == 0) {
    return false;
  }

  remainsCards = [];
  for (var i = 0; i < cards.length; ++i) {
    if (!threeOfAKind.includes(cards[i])) {
      remainsCards.push(cards[i]);
    }
  }

  return this.Pair(remainsCards);
}

PokerCalculator.prototype.Flush = function(cards) {
  var hearts = [], diamonds = [], clubs = [], spades = [], card;
  for (var i = 0; i < cards.length; ++i) {
    card = cards[i];
    suit = card.toString().split(":")[0];

    switch(suit) {
      case "H":
        hearts.push(card);
        break;

      case "D":
        diamonds.push(card);
        break;

      case "C":
        clubs.push(card);
        break;

      case "S":
        spades.push(card);
        break;
    }
  }

  if (hearts.length >= 5) {
    return hearts;
  } else if(diamonds.length >= 5) {
    return diamonds;
  } else if(clubs.length >= 5) {
    return clubs;
  } else if(spades.length >= 5) {
    return spades;
  } else {
    return [];
  }
}

PokerCalculator.prototype.Straight = function(cards) {
  // First remove repeated cards
  var cardsValues = [], card;
  for (var c = 0; c < cards.length; c++) {
    card = cards[c];
    cardValue = card.toString().split(":")[1];

    if (cardsValues.includes(cardValue)) {
      cards.splice(c, 1);
    } else {
      cardsValues.push(cardValue);
    }
  }

  // If less than 5 cards, no straight
  if (cards.length < 5) { return false; }

  var sequenceCards = cards.sort(this.compareRank), card = null, point, straight = false;
  var firstCard, aCard;

  for (var k = 0; k < sequenceCards.length; ++k) {
    firstCard = sequenceCards[0];

    for (var i = 1; i < sequenceCards.slice(0, 5).length; ++i) {
      card = sequenceCards[i];
      point = this.cardToPoint(firstCard);
      nextPoint = this.cardToPoint(card);

      if((point + 1) == nextPoint || point == nextPoint) {
        firstCard = card;
        straight = true;
      } else {
        straight = false;
        break;
      }
    }
    // if straight, break it
    if (straight) { break; }

    // reordering
    aCard = sequenceCards.shift();
    sequenceCards.push(aCard);
  }

  return straight;
}

PokerCalculator.prototype.ThreeOfAKind = function(cards) {
  var three = [], iCard, kCard, zCard, iCards = [], kCards = [], iValue, kValue, zValue;

  for (var i = 0; i < cards.length; ++i) {
    iCard = cards[i];
    iCards.push(iCard);
    kCards = [];

    for (var k = 0; k < cards.length; ++k) {
      if(three.length > 0) { break; }

      kCard = cards[k];
      kCards.push(kCard);
      if(iCards.includes(kCard)) { continue; }

      for (var z = 0; z < cards.length; ++z) {
        if(three.length > 0) { break; }

        zCard = cards[z];
        if(iCards.includes(zCard) || kCards.includes(zCard)) { continue; }
        iValue = iCard.toString().split(":")[1];
        kValue = kCard.toString().split(":")[1];
        zValue = zCard.toString().split(":")[1];

        if(iValue == kValue && kValue == zValue) {
          three = [iCard, kCard, zCard];
          break;
        }
      }
    }
  }

  return three;
}

PokerCalculator.prototype.TwoPair = function(cards) {
  var pairs = 0, iCard, kCard, iCards = [];

  for (var i = 0; i < cards.length; ++i) {
    iCard = cards[i];
    iCards.push(iCard);

    for (var k = 0; k < cards.length; ++k) {
      kCard = cards[k];
      if(iCards.includes(kCard)) { continue; }

      if(iCard.toString().split(":")[1] == kCard.toString().split(":")[1]) {
        pairs++;
      }
    }
  }

  return pairs >= 2;
}

PokerCalculator.prototype.Pair = function(cards) {
  var firstCard = cards.shift();
  var card;
  var pair = false;
  for (var i = 0; i < cards.length; ++i) {
    card = cards[i];
    if(firstCard.split(":")[1] == card.split(":")[1]) {
      pair = true;
      break;
    }
  }

  return pair;
}

PokerCalculator.prototype.HighCard = function(cards) {
  var card;
  var points = [];

  for(var i = 0; i < cards.length; ++i) {
    card = cards[i];
    points.push(this.cardToPoint(card));
  }

  return points.sort(function(a, b) { return b-a; })[0];
}

PokerCalculator.prototype.randomHand = function() {
  var hand = [];
  hand.push(this.getCard());
  hand.push(this.getCard());

  this.hands.push(hand);
  return hand;
};

PokerCalculator.prototype.randomFlop = function() {
  this.flop.push(this.getCard());
  this.flop.push(this.getCard());
  this.flop.push(this.getCard());
  this.flop.push(this.getCard());
  this.flop.push(this.getCard());

  return this.flop;
};

PokerCalculator.prototype.randomHands = function(amount) {
  for(var i = 0; i < amount; ++i) {
    this.randomHand();
  }

  return this.hands;
};

PokerCalculator.prototype.sortBestHands = function() {
  var hands = {}, hand, points;
  for (var i = 0; i < this.hands.length; ++i) {
    var hand = this.hands[i];
    points = this.calculateGame(hand, this.flop);
    hands["hand-"+(i+1)] = [points, hand];
  }

  var sortable = [];
  for (var p in hands) {
    sortable.push([p, hands[p][0], hands[p][1]]);
  }
  sortable = sortable.sort(function(a, b){
    return b[1] - a[1];
  });

  return sortable;
}

// Need to pass as: PokerCalculator.bestHand(PokerCalculator.sortBestHands())
PokerCalculator.prototype.bestHand = function(hands) {
  var bestHand = hands[0];
  return {
    cards: bestHand[2],
    points: bestHand[1]
  };
}

window.PokerCalculator = new PokerCalculator();
