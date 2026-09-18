class Blackjack {
  static MAX_POINTS = 25;
  static DEALER_MAX_TURN_POINTS = 21;

  constructor() {
    this.dealerCards = [];
    this.playerCards = [];
    this.dealerTurn = false;
    this.state = {
      gameEnded: false,
      playerWon: false,
      dealerWon: false,
      playerBusted: false,
      dealerBusted: false,
    };
    this.deck = this.shuffle(this.newDeck());
  }

  newDeck() {
    const suits = ["♥", "♦", "♣", "♠"];
    const ranks = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];
    const deck = [];
    for (let suit of suits) {
      for (let rank of ranks) {
        deck.push({ suit, rank });
      }
    }
    return deck;
  }

  shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  getDealerCards() {
    return this.dealerCards.slice();
  }

  getPlayerCards() {
    return this.playerCards.slice();
  }

  setDealerTurn(val) {
    this.dealerTurn = val;
  }

  getCardsValue(cards) {
    let value = 0;
    let aces = 0;
    for (let card of cards) {
      if (["J", "Q", "K"].includes(card.rank)) {
        value += 10;
      } else if (card.rank === "A") {
        value += 11;
        aces += 1;
      } else {
        value += parseInt(card.rank);
      }
    }
    while (value > Blackjack.MAX_POINTS && aces > 0) {
      value -= 10;
      aces -= 1;
    }
    return value;
  }

  dealerMove() {
    if (this.deck.length > 0) {
      this.dealerCards.push(this.deck.pop());
    }
    return this.getGameState();
  }

  playerMove() {
    if (this.deck.length > 0) {
      this.playerCards.push(this.deck.pop());
    }
    return this.getGameState();
  }

  getGameState() {
    const playerPts = this.getCardsValue(this.playerCards);
    const dealerPts = this.getCardsValue(this.dealerCards);

    this.state.playerScore = playerPts;
    this.state.dealerScore = dealerPts;

    this.state.playerBusted = playerPts > Blackjack.MAX_POINTS;
    this.state.dealerBusted = dealerPts > Blackjack.MAX_POINTS;

    if (this.state.playerBusted) {
      this.state.gameEnded = true;
      this.state.dealerWon = true;
      this.state.playerWon = false;
    } else if (this.state.dealerBusted) {
      this.state.gameEnded = true;
      this.state.playerWon = true;
      this.state.dealerWon = false;
    } else if (this.dealerTurn) {
      // O Dealer para se ultrapassar o Player, OU se estiver empatado num valor seguro de 21 pontos.
      if (
        dealerPts > playerPts ||
        (dealerPts === playerPts &&
          dealerPts >= Blackjack.DEALER_MAX_TURN_POINTS)
      ) {
        this.state.gameEnded = true;
        if (dealerPts > playerPts) {
          this.state.dealerWon = true;
          this.state.playerWon = false;
        } else if (playerPts > dealerPts) {
          this.state.playerWon = true;
          this.state.dealerWon = false;
        } else {
          this.state.dealerWon = false;
          this.state.playerWon = false;
        }
      }
    }
    return this.state;
  }
}
