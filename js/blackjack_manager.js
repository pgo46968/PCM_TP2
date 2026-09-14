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
    document.getElementById("player-score").innerText = state.playerScore;
  }

  // Lógica condicional para a pontuação do Dealer
  if (state.dealerScore !== undefined) {
    if (game.dealerTurn === false) {
      // Se for a vez do Jogador: Calcula e mostra APENAS o valor da 1ª carta do Dealer
      let cartasDealer = game.getDealerCards();
      if (cartasDealer.length > 0) {
        let pontuacaoVisivel = game.getCardsValue([cartasDealer[0]]);
        document.getElementById("dealer-score").innerText = pontuacaoVisivel;
      }
    } else {
      // Se for a vez do Dealer (carta já virada): Mostra o total real
      document.getElementById("dealer-score").innerText = state.dealerScore;
    }
  }

  if (state.gameEnded) {
    finalizeButtons();
    finalScore(state);
  }
}

function updateDealer(state) {
  // Mantém os totais sincronizados usando a mesma lógica
  if (state.playerScore !== undefined) {
    document.getElementById("player-score").innerText = state.playerScore;
  }

  if (state.dealerScore !== undefined) {
    // Como o updateDealer só é chamado quando já é o turno do Dealer,
    // podemos mostrar a pontuação total diretamente.
    document.getElementById("dealer-score").innerText = state.dealerScore;
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
  // 1. Bloqueia os botões imediatamente após o 1º clique para evitar cliques repetidos
  document.getElementById("card").disabled = true;
  document.getElementById("stand").disabled = true;

  // 2. Muda o turno para o Dealer
  game.setDealerTurn(true);

  // 3. Atualiza o estado (Isto diz à lógica que agora as regras do Dealer aplicam-se)
  let state = game.getGameState();

  // 4. Revela a carta escondida
  let dealerDiv = document.getElementById("dealer");
  let dCards = game.getDealerCards();

  if (dealerDiv && dealerDiv.children[1] && dCards[1]) {
    printCard(dealerDiv.children[1], dCards[1], true);
  }

  // Sincroniza a pontuação do dealer no ecrã (como a carta escondida já foi virada, o total atualiza)
  updateDealer(state);

  // 5. Função recursiva com temporizador (Substitui o antigo ciclo while)
  function tirarProximaCarta(estadoAtual) {
    // Se o jogo ainda não terminou, aguarda 1 segundo e tira outra carta
    if (!estadoAtual.gameEnded) {
      setTimeout(() => {
        // Tira a carta, desenha no ecrã e avalia o novo estado
        let proximoEstado = dealerNewCard();

        // Chama a própria função novamente para ver se precisa de mais cartas
        tirarProximaCarta(proximoEstado);
      }, 1000); // 1000 representa 1 segundo de intervalo. Pode alterar para 500 para ser mais rápido.
    }
  }

  // 6. Inicia o processo automático de tirar as cartas
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
