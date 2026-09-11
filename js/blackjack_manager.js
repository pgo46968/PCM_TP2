// Blackjack OOP

let game = null; // Stores the current instance of the game

/**
 * Function to debug and display the state of the game object.
 * @param {Object} obj - The object to be debugged.
 */
function debug(obj) {
  document.getElementById("debug").innerHTML = JSON.stringify(obj); // Displays the state of the object as JSON
}

/**
 * Initializes the game buttons.
 */
function buttonsInitialization() {
  document.getElementById("card").disabled = false; // Enables the button to draw a card
  document.getElementById("stand").disabled = false; // Enables the button to stand
  document.getElementById("new_game").disabled = true; // Disables the button for a new game
}

/**
 * Finalizes the buttons after the game ends.
 */
function finalizeButtons() {
  //TODO: Reveal the dealer's hidden card if you hid it like you were supposed to.
  if (game) {
    let dealerDiv = document.getElementById("dealer");
    let dCards = game.getDealerCards();
    if (dealerDiv && dealerDiv.children[1]) {
      // Substitui o placeholder da 2ª carta pela carta real
      printCard(dealerDiv.children[1], dCards[1], true);
    }
  }

  document.getElementById("card").disabled = true; // Disables the button to draw a card
  document.getElementById("stand").disabled = true; // Disables the button to stand
  document.getElementById("new_game").disabled = false; // Enables the button for a new game
}

//TODO: Implement this method.
/**
 * Clears the page to start a new game.
 */
function clearPage() {
  document.getElementById("dealer").innerHTML = "";
  document.getElementById("player").innerHTML = "";

  // Assumindo que tens uma div para mostrar o resultado final
  let resultDiv = document.getElementById("game_status");
  if (resultDiv) resultDiv.innerHTML = "";
}

//TODO: Complete this method.
/**
 * Starts a new game of Blackjack.
 */
function newGame() {
  clearPage();
  game = new Blackjack(); // Creates a new instance of the Blackjack game
  buttonsInitialization(); // Prepara os botões para jogar

  // Distribui as duas cartas iniciais para o jogador e para o dealer
  game.playerMove();
  game.playerMove();
  game.dealerMove();
  game.dealerMove();

  let playerDiv = document.getElementById("player");
  let dealerDiv = document.getElementById("dealer");

  let pCards = game.getPlayerCards();
  let dCards = game.getDealerCards();

  // Imprime as cartas do jogador
  printCard(playerDiv, pCards[0]);
  printCard(playerDiv, pCards[1]);

  // Imprime a 1ª carta do dealer e esconde a 2ª
  printCard(dealerDiv, dCards[0]);

  // Cria um elemento placeholder para a carta escondida
  let hiddenCardDiv = document.createElement("div");
  hiddenCardDiv.className = "card hidden-card";
  hiddenCardDiv.innerHTML = "🂠"; // Símbolo de costas de carta
  dealerDiv.appendChild(hiddenCardDiv);

  debug(game); // Displays the current state of the game for debugging

  // Verifica se houve blackjack imediato (ex: 21 ou 25 pontos log de início)
  updatePlayer(game.getGameState());
}

  function finalScore(state) {
    let resultDiv = document.getElementById("game_status");
    if (!resultDiv) return;

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

  //TODO: Implement this method.
  /**
   * Updates the dealer's state in the game.
   * @param {Object} state - The current state of the game.
   */
  function updateDealer(state) {
    if (state.gameEnded) {
      finalizeButtons();
      finalScore(state);
    }
  }

  //TODO: Implement this method.
  /**
   * Updates the player's state in the game.
   * @param {Object} state - The current state of the game.
   */
  function updatePlayer(state) {
    if (state.gameEnded) {
      finalizeButtons();
      finalScore(state);
    }
  }

  //TODO: Implement this method.
  /**
   * Causes the dealer to draw a new card.
   * @returns {Object} - The game state after the dealer's move.
   */
  function dealerNewCard() {
    let state = game.dealerMove();
    let dCards = game.getDealerCards();

    // Imprime apenas a última carta adicionada
    printCard(document.getElementById("dealer"), dCards[dCards.length - 1]);

    updateDealer(state);
    debug(game);
    return state;
  }

  //TODO: Implement this method.
  /**
   * Causes the player to draw a new card.
   * @returns {Object} - The game state after the player's move.
   */
  function playerNewCard() {
    let state = game.playerMove();
    let pCards = game.getPlayerCards();

    printCard(document.getElementById("player"), pCards[pCards.length - 1]);

    updatePlayer(state);
    debug(game);
  }

  //TODO: Implement this method.
  /**
   * Finishes the dealer's turn.
   */
  function dealerFinish() {
    game.setDealerTurn(true);
    let state = game.getGameState(); // Reavalia o estado agora que é o turno do dealer

    // Revela a carta escondida primeiro (caso não tenha sido revelada)
    let dealerDiv = document.getElementById("dealer");
    let dCards = game.getDealerCards();
    if (dealerDiv && dealerDiv.children[1]) {
      printCard(dealerDiv.children[1], dCards[1], true);
    }

    // O dealer continua a tirar cartas até o jogo terminar pelas regras (busted ou >= pontos mínimos)
    while (!state.gameEnded) {
      state = dealerNewCard();
    }

    // updateDealer() dentro do dealerNewCard já chama o finalizeButtons/finalScore
  }

  //TODO: Implement this method.
  /**
   * Prints the card in the graphical interface.
   * @param {HTMLElement} element - The element where the card will be displayed.
   * @param {Card} card - The card to be displayed.
   * @param {boolean} [replace=false] - Indicates whether to replace the existing image.
   */
  function printCard(element, card, replace = false) {
    if (!element) return;

    const cardText = `${card.rank}${card.suit}`;

    if (replace) {
      element.innerHTML = cardText;
      element.className = "card"; // Remove a classe 'hidden-card' se existir
    } else {
      let cardDiv = document.createElement("div");
      cardDiv.className = "card";
      cardDiv.innerHTML = cardText;
      element.appendChild(cardDiv);
    }
  }
}
