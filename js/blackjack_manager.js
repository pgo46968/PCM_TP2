// Blackjack OOP

let game = null; // Stores the current instance of the game


/**
 * Function to debug and display the state of the game object.
 * @param {Object} obj - The object to be debugged.
 */
function debug(obj) {
  let debugDiv = document.getElementById("debug");
  // Só tenta atualizar os dados se o elemento "debug" estiver ativo no HTML
  if (debugDiv) {
    debugDiv.innerHTML = JSON.stringify(obj);
  }
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

  // Limpa os ícones e reseta os totais para a nova ronda
  document.getElementById("player-icon").innerText = "";
  document.getElementById("dealer-icon").innerText = "";
  document.getElementById("player-score").innerText = "0";
  document.getElementById("dealer-score").innerText = "0";
}

/**
 * Displays the final result of the game.
 * @param {Object} state - Current game state.
 */
function finalScore(state) {
  let resultDiv = document.getElementById("game_status");
  let playerIcon = document.getElementById('player-icon');
  let dealerIcon = document.getElementById('dealer-icon');

  // Aborta a função se a página ainda não tiver carregado estes elementos
  if (!resultDiv || !playerIcon || !dealerIcon) {
      return;
  }

  if (state.playerBusted) {
    resultDiv.innerHTML = "O Jogador rebentou! O Dealer vence.";
    playerIcon.innerText = '✖'; playerIcon.className = 'result-icon icon-lose';
    dealerIcon.innerText = '✔'; dealerIcon.className = 'result-icon icon-win';
  } else if (state.dealerBusted) {
    resultDiv.innerHTML = "O Dealer rebentou! O Jogador vence!";
    playerIcon.innerText = '✔'; playerIcon.className = 'result-icon icon-win';
    dealerIcon.innerText = '✖'; dealerIcon.className = 'result-icon icon-lose';
  } else if (state.playerWon) {
    resultDiv.innerHTML = "O Jogador vence!";
    playerIcon.innerText = '✔'; playerIcon.className = 'result-icon icon-win';
    dealerIcon.innerText = '✖'; dealerIcon.className = 'result-icon icon-lose';
  } else if (state.dealerWon) {
    resultDiv.innerHTML = "O Dealer vence!";
    playerIcon.innerText = '✖'; playerIcon.className = 'result-icon icon-lose';
    dealerIcon.innerText = '✔'; dealerIcon.className = 'result-icon icon-win';
  } else {
    resultDiv.innerHTML = "Empate!";
    playerIcon.innerText = '='; playerIcon.className = 'result-icon';
    dealerIcon.innerText = '='; dealerIcon.className = 'result-icon';
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

function updatePlayer(state) {
  // Atualiza sempre a pontuação total do jogador
  if (state.playerScore !== undefined) {
      document.getElementById('player-score').innerText = state.playerScore;
  }

  // Lógica condicional para a pontuação do Dealer
  if (state.dealerScore !== undefined) {
      // CORREÇÃO: Só esconde a carta se for a vez do Jogador E o jogo não tiver terminado
      if (game.dealerTurn === false && state.gameEnded === false) {
          let cartasDealer = game.getDealerCards();
          if (cartasDealer.length > 0) {
              let pontuacaoVisivel = game.getCardsValue([cartasDealer[0]]);
              document.getElementById('dealer-score').innerText = pontuacaoVisivel;
          }
      } else {
          // Se for a vez do Dealer OU o jogo já tiver acabado (ex: Jogador rebentou): Mostra o total real
          document.getElementById('dealer-score').innerText = state.dealerScore;
      }
  }

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
  // 1. Bloqueia os botões imediatamente após o 1º clique
  document.getElementById("card").disabled = true;
  document.getElementById("stand").disabled = true;

  // 2. Muda o turno para o Dealer e recalcula o estado (somando as 2 cartas)
  game.setDealerTurn(true);
  let state = game.getGameState();

  // 3. Revela a carta escondida no ecrã
  let dealerDiv = document.getElementById("dealer");
  let dCards = game.getDealerCards();

  if (dealerDiv && dealerDiv.children[1] && dCards[1]) {
    printCard(dealerDiv.children[1], dCards[1], true);
  }

  // 4. CORREÇÃO: Força o ecrã a mostrar imediatamente o total real do Dealer
  document.getElementById('dealer-score').innerText = state.dealerScore;

  // 5. Avalia se o jogo terminou imediatamente com as duas cartas (ex: atingiu logo 21)
  if (state.gameEnded) {
    updateDealer(state); // Exibe os ícones de vitória/derrota
    return; // Interrompe a função aqui para não tentar tirar mais cartas
  }

  // 6. Caso o jogo não tenha terminado, inicia o temporizador para puxar mais cartas
  function tirarProximaCarta(estadoAtual) {
    if (!estadoAtual.gameEnded) {
      setTimeout(() => {
        let proximoEstado = dealerNewCard();
        tirarProximaCarta(proximoEstado);
      }, 1000); // Pausa de 1 segundo entre cartas
    }
  }

  tirarProximaCarta(state);
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
