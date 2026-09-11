// Blackjack OOP

let game = null; // Stores the current instance of the game

/**
 * Function to debug and display the state of the game object.
 * @param {Object} obj - The object to be debugged.
 */
function debug(obj) {
  document.getElementById("debug").innerHTML = JSON.stringify(obj);
}

/**
 * Initializes the game buttons.
 */
function buttonsInitialization() {
  document.getElementById("card").disabled = false;
  document.getElementById("stand").disabled = false;
  document.getElementById("new_game").disabled = true;
}

/**
 * Finalizes the buttons after the game ends.
 */
function finalizeButtons() {
  // Reveal the dealer's hidden card
  if (game) {
    let dealerDiv = document.getElementById("dealer");
    let dCards = game.getDealerCards();

    if (dealerDiv && dealerDiv.children[1] && dCards[1]) {
      printCard(dealerDiv.children[1], dCards[1], true);
    }
  }

  // Disable game buttons
  document.getElementById("card").disabled = true;
  document.getElementById("stand").disabled = true;

  // Enable new game button
  document.getElementById("new_game").disabled = false;
}

/**
 * Clears the page to start a new game.
 */
function clearPage() {
  document.getElementById("dealer").innerHTML = "";
  document.getElementById("player").innerHTML = "";

  let resultDiv = document.getElementById("game_status");

  if (resultDiv) {
    resultDiv.innerHTML = "";
  }
}

/**
 * Displays the final result of the game.
 * @param {Object} state - Current game state.
 */
function finalScore(state) {
  let resultDiv = document.getElementById("game_status");

  if (!resultDiv) {
    return;
  }

  if (state.playerBusted) {
    resultDiv.innerHTML = "O Jogador rebentou! O Dealer vence.";
  } else if (state.dealerBusted) {
    resultDiv.innerHTML = "O Dealer rebentou! O Jogador vence!";
  } else if (state.playerWon) {
    resultDiv.innerHTML = "O Jogador vence!";
  } else if (state.dealerWon) {
    resultDiv.innerHTML = "O Dealer vence!";
  } else {
    resultDiv.innerHTML = "Empate!";
  }
}

/**
 * Starts a new game of Blackjack.
 */
function newGame() {
  clearPage();

  // Create a new Blackjack object
  game = new Blackjack();

  // Initialize buttons
  buttonsInitialization();

  // Deal two cards to the player
  game.playerMove();
  game.playerMove();

  // Deal two cards to the dealer
  game.dealerMove();
  game.dealerMove();

  let playerDiv = document.getElementById("player");
  let dealerDiv = document.getElementById("dealer");

  let pCards = game.getPlayerCards();
  let dCards = game.getDealerCards();

  // Display player's two cards
  printCard(playerDiv, pCards[0]);
  printCard(playerDiv, pCards[1]);

  // Display dealer's first card
  printCard(dealerDiv, dCards[0]);

  // Create hidden card for dealer's second card
  let hiddenCardDiv = document.createElement("div");

  hiddenCardDiv.className = "card hidden-card";
  hiddenCardDiv.innerHTML = "🂠";

  dealerDiv.appendChild(hiddenCardDiv);

  // Debug
  debug(game);

  // Check initial game state
  updatePlayer(game.getGameState());
}

/**
 * Updates the player's state in the game.
 * @param {Object} state - The current game state.
 */
function updatePlayer(state) {
  if (state.gameEnded) {
    finalizeButtons();
    finalScore(state);
  }
}

/**
 * Updates the dealer's state in the game.
 * @param {Object} state - The current game state.
 */
function updateDealer(state) {
  if (state.gameEnded) {
    finalizeButtons();
    finalScore(state);
  }
}

/**
 * Causes the player to draw a new card.
 */
function playerNewCard() {
  // Ask the Blackjack object for a new card
  let state = game.playerMove();

  // Get player's cards
  let pCards = game.getPlayerCards();

  // Get the last card
  let lastCard = pCards[pCards.length - 1];

  // Display the new card
  printCard(document.getElementById("player"), lastCard);

  // Update game state
  updatePlayer(state);

  // Debug
  debug(game);
}

/**
 * Causes the dealer to draw a new card.
 */
function dealerNewCard() {
  // Ask the Blackjack object for a new card
  let state = game.dealerMove();

  // Get dealer's cards
  let dCards = game.getDealerCards();

  // Get the last card
  let lastCard = dCards[dCards.length - 1];

  // Display the new card
  printCard(document.getElementById("dealer"), lastCard);

  // Update game state
  updateDealer(state);

  // Debug
  debug(game);

  return state;
}

/**
 * Finishes the dealer's turn.
 */
function dealerFinish() {
  // Change to dealer's turn
  game.setDealerTurn(true);

  // Get current state
  let state = game.getGameState();

  // Get dealer elements and cards
  let dealerDiv = document.getElementById("dealer");
  let dCards = game.getDealerCards();

  // Reveal the hidden second card
  if (dealerDiv && dealerDiv.children[1] && dCards[1]) {
    printCard(dealerDiv.children[1], dCards[1], true);
  }

  // Dealer draws cards until game ends
  while (!state.gameEnded) {
    state = dealerNewCard();
  }
}

/**
 * Prints a card in the graphical interface.
 *
 * @param {HTMLElement} element - Element where the card will be displayed.
 * @param {Object} card - Card to be displayed.
 * @param {boolean} replace - Indicates whether to replace an existing card.
 */
function printCard(element, card, replace = false) {
  if (!element || !card) {
    return;
  }

  const cardText = `${card.rank}${card.suit}`;

  if (replace) {
    // Replace hidden card
    element.innerHTML = cardText;
    element.className = "card";
  } else {
    // Create a new card
    let cardDiv = document.createElement("div");

    cardDiv.className = "card";
    cardDiv.innerHTML = cardText;

    element.appendChild(cardDiv);
  }
}
