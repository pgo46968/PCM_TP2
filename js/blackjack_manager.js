let game = null;

function debug(obj) {
  let debugDiv = document.getElementById("debug");
  if (debugDiv) debugDiv.innerHTML = JSON.stringify(obj);
}

function buttonsInitialization() {
  document.getElementById("card").disabled = false;
  document.getElementById("stand").disabled = false;
  document.getElementById("new_game").disabled = true;
}

function finalizeButtons() {
  if (game) {
    let dealerDiv = document.getElementById("dealer");
    let dCards = game.getDealerCards();
    if (dealerDiv && dealerDiv.children[1] && dCards[1]) {
      printCard(dealerDiv.children[1], dCards[1], true);
    }
  }
  document.getElementById("card").disabled = true;
  document.getElementById("stand").disabled = true;
  document.getElementById("new_game").disabled = false;
}

function clearPage() {
  document.getElementById("dealer").innerHTML = "";
  document.getElementById("player").innerHTML = "";

  let resultDiv = document.getElementById("game_status");
  if (resultDiv) resultDiv.innerHTML = "";

  let playerIcon = document.getElementById("player-icon");
  if (playerIcon) {
    playerIcon.innerText = "";
    playerIcon.className = "result-icon";
  }

  let dealerIcon = document.getElementById("dealer-icon");
  if (dealerIcon) {
    dealerIcon.innerText = "";
    dealerIcon.className = "result-icon";
  }

  let playerScore = document.getElementById("player-score");
  if (playerScore) playerScore.innerText = "0";

  let dealerScore = document.getElementById("dealer-score");
  if (dealerScore) dealerScore.innerText = "0";
}

function finalScore(state) {
  let resultDiv = document.getElementById("game_status");
  let playerIcon = document.getElementById("player-icon");
  let dealerIcon = document.getElementById("dealer-icon");

  if (!resultDiv || !playerIcon || !dealerIcon) return;

  if (state.playerBusted) {
    resultDiv.innerHTML = "O Player rebentou! O Dealer vence.";
    playerIcon.innerText = "✖";
    playerIcon.className = "result-icon icon-lose";
    dealerIcon.innerText = "✔";
    dealerIcon.className = "result-icon icon-win";
  } else if (state.dealerBusted) {
    resultDiv.innerHTML = "O Dealer rebentou! O Player vence!";
    playerIcon.innerText = "✔";
    playerIcon.className = "result-icon icon-win";
    dealerIcon.innerText = "✖";
    dealerIcon.className = "result-icon icon-lose";
  } else if (state.playerWon) {
    resultDiv.innerHTML = "O Player vence!";
    playerIcon.innerText = "✔";
    playerIcon.className = "result-icon icon-win";
    dealerIcon.innerText = "✖";
    dealerIcon.className = "result-icon icon-lose";
  } else if (state.dealerWon) {
    resultDiv.innerHTML = "O Dealer vence!";
    playerIcon.innerText = "✖";
    playerIcon.className = "result-icon icon-lose";
    dealerIcon.innerText = "✔";
    dealerIcon.className = "result-icon icon-win";
  } else {
    resultDiv.innerHTML = "Empate!";
    playerIcon.innerText = "=";
    playerIcon.className = "result-icon";
    dealerIcon.innerText = "=";
    dealerIcon.className = "result-icon";
  }
}

function newGame() {
  clearPage();
  game = new Blackjack();
  buttonsInitialization();

  game.playerMove();
  game.playerMove();
  game.dealerMove();
  game.dealerMove();

  let playerDiv = document.getElementById("player");
  let dealerDiv = document.getElementById("dealer");
  let pCards = game.getPlayerCards();
  let dCards = game.getDealerCards();

  printCard(playerDiv, pCards[0]);
  printCard(playerDiv, pCards[1]);
  printCard(dealerDiv, dCards[0]);

  let hiddenCardDiv = document.createElement("div");
  hiddenCardDiv.className = "card hidden-card";
  hiddenCardDiv.innerHTML = "🂠";
  dealerDiv.appendChild(hiddenCardDiv);

  debug(game);
  updatePlayer(game.getGameState());
}

function updatePlayer(state) {
  let pScore = document.getElementById("player-score");
  if (state.playerScore !== undefined && pScore) {
    pScore.innerText = state.playerScore;
  }

  let dScore = document.getElementById("dealer-score");
  if (state.dealerScore !== undefined && dScore) {
    if (game.dealerTurn === false && state.gameEnded === false) {
      let cartasDealer = game.getDealerCards();
      if (cartasDealer.length > 0) {
        dScore.innerText = game.getCardsValue([cartasDealer[0]]);
      }
    } else {
      dScore.innerText = state.dealerScore;
    }
  }

  if (state.gameEnded) {
    finalizeButtons();
    finalScore(state);
  }
}

function updateDealer(state) {
  let pScore = document.getElementById("player-score");
  if (state.playerScore !== undefined && pScore) {
    pScore.innerText = state.playerScore;
  }

  let dScore = document.getElementById("dealer-score");
  if (state.dealerScore !== undefined && dScore) {
    dScore.innerText = state.dealerScore;
  }

  if (state.gameEnded) {
    finalizeButtons();
    finalScore(state);
  }
}

function playerNewCard() {
  let state = game.playerMove();
  let pCards = game.getPlayerCards();
  let lastCard = pCards[pCards.length - 1];

  printCard(document.getElementById("player"), lastCard);
  updatePlayer(state);
  debug(game);
}

function dealerNewCard() {
  let state = game.dealerMove();
  let dCards = game.getDealerCards();
  let lastCard = dCards[dCards.length - 1];

  printCard(document.getElementById("dealer"), lastCard);
  updateDealer(state);
  debug(game);
  return state;
}

function dealerFinish() {
  document.getElementById("card").disabled = true;
  document.getElementById("stand").disabled = true;

  game.setDealerTurn(true);
  let state = game.getGameState();

  let dealerDiv = document.getElementById("dealer");
  let dCards = game.getDealerCards();

  if (dealerDiv && dealerDiv.children[1] && dCards[1]) {
    printCard(dealerDiv.children[1], dCards[1], true);
  }

  let dScore = document.getElementById("dealer-score");
  if (dScore) dScore.innerText = state.dealerScore;

  if (state.gameEnded) {
    updateDealer(state);
    return;
  }

  function tirarProximaCarta(estadoAtual) {
    if (!estadoAtual.gameEnded) {
      setTimeout(() => {
        let proximoEstado = dealerNewCard();
        tirarProximaCarta(proximoEstado);
      }, 1000);
    }
  }

  tirarProximaCarta(state);
}

function printCard(element, card, replace = false) {
  if (!element || !card) return;

  const cardText = `${card.rank}${card.suit}`;
  // Verifica se o naipe é de Copas ou Ouros
  const isRed = card.suit === "♥" || card.suit === "♦";
  const cardClass = isRed ? "card red-suit" : "card";

  if (replace) {
    element.innerHTML = cardText;
    element.className = cardClass;
  } else {
    let cardDiv = document.createElement("div");
    cardDiv.className = cardClass;
    cardDiv.innerHTML = cardText;
    element.appendChild(cardDiv);
  }
}
