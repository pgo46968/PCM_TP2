// Blackjack object

/**
 * Class that represents the Blackjack game.
 */
class Blackjack {
  // Constant that defines the maximum points to avoid busting in Blackjack
  static MAX_POINTS = 25;
  // Constant that defines the point threshold at which the dealer must stand
  static DEALER_MAX_TURN_POINTS = 21;

  /**
   * Creates an instance of Blackjack and initializes the deck.
   */
  constructor() {
    this.dealerCards = []; // Array to hold the dealer's cards
    this.playerCards = []; // Array to hold the player's cards
    this.dealerTurn = false; // Flag to indicate if it's the dealer's turn to play

    // State of the game with information about the outcome
    this.state = {
      gameEnded: false, // Indicates whether the game has ended
      playerWon: false, // Indicates if the player has won
      dealerWon: false, // Indicates if the dealer has won
      playerBusted: false, // Indicates if the player has exceeded MAX_POINTS
      dealerBusted: false, // Indicates if the dealer has exceeded MAX_POINTS
    };

    // Initialize the deck of cards
    this.deck = this.shuffle(this.newDeck()); // Create and shuffle a new deck
  }

  //TODO: Implement this method
  /**
   * Creates a new deck of cards.
   * @returns {Card[]} - An array of cards.
   */

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

  //TODO: Implement this method
  /**
   * Shuffles the deck of cards.
   * @param {Card[]} deck - The deck of cards to be shuffled.
   * @returns {Card[]} - The shuffled deck.
   */
  shuffle(deck) {
    // Implementação do algoritmo Fisher-Yates Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  /**
   * Returns the dealer's cards.
   * @returns {Card[]} - An array containing the dealer's cards.
   */
  getDealerCards() {
    return this.dealerCards.slice(); // Return a copy of the dealer's cards
  }

  /**
   * Returns the player's cards.
   * @returns {Card[]} - An array containing the player's cards.
   */
  getPlayerCards() {
    return this.playerCards.slice(); // Return a copy of the player's cards
  }

  /**
   * Sets whether it is the dealer's turn to play.
   * @param {boolean} val - Value indicating if it's the dealer's turn.
   */
  setDealerTurn(val) {
    this.dealerTurn = val; // Update the dealer's turn status
  }

  //TODO: Implement this method
  /**
   * Calculates the total value of the provided cards.
   * @param {Card[]} cards - Array of cards to be evaluated.
   * @returns {number} - The total value of the cards.
   */
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

    // Ajusta o valor dos Ases (de 11 para 1) se o valor ultrapassar o limite MAX_POINTS
    while (value > Blackjack.MAX_POINTS && aces > 0) {
      value -= 10;
      aces -= 1;
    }

    return value;
  }

  //TODO: Implement this method
  /**
   * Executes the dealer's move by adding a card to the dealer's array.
   * @returns {Object} - The game state after the dealer's move.
   */
  dealerMove() {
    if (this.deck.length > 0) {
      this.dealerCards.push(this.deck.pop()); // Retira a carta do baralho e adiciona ao dealer
    }
    return this.getGameState();
  }

  //TODO: Implement this method
  /**
   * Executes the player's move by adding a card to the player's array.
   * @returns {Object} - The game state after the player's move.
   */
  playerMove() {
    if (this.deck.length > 0) {
      this.playerCards.push(this.deck.pop()); // Retira a carta do baralho e adiciona ao jogador
    }
    return this.getGameState();
  }

  //TODO: Implement this method
  /**
   * Checks the game state based on the dealer's and player's cards.
   * @returns {Object} - The updated game state.
   */
  getGameState() {
    const playerPts = this.getCardsValue(this.playerCards);
    const dealerPts = this.getCardsValue(this.dealerCards);

    // Verifica se alguém rebentou o limite estipulado na classe (25 pontos)
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
      // Se for o turno do dealer, verifica se ele atingiu os pontos necessários para parar
      if (dealerPts >= Blackjack.DEALER_MAX_TURN_POINTS) {
        this.state.gameEnded = true;
        if (dealerPts > playerPts) {
          this.state.dealerWon = true;
        } else if (playerPts > dealerPts) {
          this.state.playerWon = true;
        } else {
          // Em caso de empate, ambos mantêm a flag a 'false' ou podes ajustar a lógica de state
          this.state.dealerWon = false;
          this.state.playerWon = false;
        }
      }
    }

    return this.state;
  }
}
