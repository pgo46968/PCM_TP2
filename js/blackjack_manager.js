// Variável global que irá guardar a instância atual do jogo
let game = null;

// Função de depuração (debug) para imprimir o estado interno do jogo em formato JSON
function debug(obj) {
  let debugDiv = document.getElementById("debug");
  if (debugDiv) debugDiv.innerHTML = JSON.stringify(obj);
}

// Inicializa o estado dos botões quando um novo jogo começa
function buttonsInitialization() {
  document.getElementById("card").disabled = false;    // Ativa o botão de pedir carta ("Card")
  document.getElementById("stand").disabled = false;   // Ativa o botão de parar/manter ("Stop")
  document.getElementById("new_game").disabled = true; // Desativa o botão de iniciar um novo jogo
}

// Finaliza o estado dos botões e revela a carta escondida do dealer quando a partida termina
function finalizeButtons() {
  if (game) {
    let dealerDiv = document.getElementById("dealer");
    let dCards = game.getDealerCards(); // Obtém a lista de cartas do dealer
    
    // Se a área do dealer e a segunda carta (índice 1) existirem no DOM e na lógica, revela a carta
    if (dealerDiv && dealerDiv.children[1] && dCards[1]) {
      printCard(dealerDiv.children[1], dCards[1], true);
    }
  }
  
  // Desativa as ações do jogador e volta a ativar o botão de novo jogo
  document.getElementById("card").disabled = true;
  document.getElementById("stand").disabled = true;
  document.getElementById("new_game").disabled = false;
}

// Limpa todos os elementos visuais da página para preparar uma nova partida
function clearPage() {
  document.getElementById("dealer").innerHTML = ""; // Limpa a zona de cartas visuais do dealer
  document.getElementById("player").innerHTML = ""; // Limpa a zona de cartas visuais do jogador

  // Limpa a barra de estado onde aparece a mensagem final
  let resultDiv = document.getElementById("game_status");
  if (resultDiv) resultDiv.innerHTML = "";

  // Repõe a zero o ícone de resultado (✔ ou ✖) do jogador
  let playerIcon = document.getElementById("player-icon");
  if (playerIcon) {
    playerIcon.innerText = "";
    playerIcon.className = "result-icon"; // Remove classes de vitória/derrota (cores verde/vermelho)
  }

  // Repõe a zero o ícone de resultado do dealer
  let dealerIcon = document.getElementById("dealer-icon");
  if (dealerIcon) {
    dealerIcon.innerText = "";
    dealerIcon.className = "result-icon";
  }

  // Coloca as pontuações visuais a zeros
  let playerScore = document.getElementById("player-score");
  if (playerScore) playerScore.innerText = "0";

  let dealerScore = document.getElementById("dealer-score");
  if (dealerScore) dealerScore.innerText = "0";
}

// Avalia o estado do jogo e apresenta no ecrã quem venceu a partida
function finalScore(state) {
  let resultDiv = document.getElementById("game_status");
  let playerIcon = document.getElementById("player-icon");
  let dealerIcon = document.getElementById("dealer-icon");

  // Sai da função por precaução, caso os elementos HTML não existam
  if (!resultDiv || !playerIcon || !dealerIcon) return;

  // Verifica as diferentes condições de fim de jogo e atualiza textos e ícones em conformidade
  if (state.playerBusted) {
    // O jogador excedeu a pontuação máxima (rebentou)
    resultDiv.innerHTML = "O Player rebentou! O Dealer vence.";
    playerIcon.innerText = "✖";
    playerIcon.className = "result-icon icon-lose"; // Fica vermelho
    dealerIcon.innerText = "✔";
    dealerIcon.className = "result-icon icon-win";  // Fica verde
  } else if (state.dealerBusted) {
    // O dealer excedeu a pontuação máxima
    resultDiv.innerHTML = "O Dealer rebentou! O Player vence!";
    playerIcon.innerText = "✔";
    playerIcon.className = "result-icon icon-win";
    dealerIcon.innerText = "✖";
    dealerIcon.className = "result-icon icon-lose";
  } else if (state.playerWon) {
    // O jogador obteve uma pontuação válida superior à do dealer
    resultDiv.innerHTML = "O Player vence!";
    playerIcon.innerText = "✔";
    playerIcon.className = "result-icon icon-win";
    dealerIcon.innerText = "✖";
    dealerIcon.className = "result-icon icon-lose";
  } else if (state.dealerWon) {
    // O dealer obteve uma pontuação válida superior à do jogador
    resultDiv.innerHTML = "O Dealer vence!";
    playerIcon.innerText = "✖";
    playerIcon.className = "result-icon icon-lose";
    dealerIcon.innerText = "✔";
    dealerIcon.className = "result-icon icon-win";
  } else {
    // Caso de empate (mesma pontuação)
    resultDiv.innerHTML = "Empate!";
    playerIcon.innerText = "=";
    playerIcon.className = "result-icon";
    dealerIcon.innerText = "=";
    dealerIcon.className = "result-icon";
  }
}

// Função principal de arranque, responsável por iniciar e configurar um novo jogo
function newGame() {
  clearPage(); // Limpa a mesa de jogos anteriores
  game = new Blackjack(); // Instancia um novo objeto de lógica de jogo
  buttonsInitialization(); // Prepara os botões para arrancar

  // Distribui as duas cartas iniciais para o jogador e duas para o dealer na lógica interna
  game.playerMove();
  game.playerMove();
  game.dealerMove();
  game.dealerMove();

  let playerDiv = document.getElementById("player");
  let dealerDiv = document.getElementById("dealer");
  let pCards = game.getPlayerCards();
  let dCards = game.getDealerCards();

  // Desenha na mesa as duas cartas visíveis do jogador
  printCard(playerDiv, pCards[0]);
  printCard(playerDiv, pCards[1]);
  
  // Desenha na mesa apenas a primeira carta visível do dealer
  printCard(dealerDiv, dCards[0]);

  // A segunda carta do dealer é desenhada como uma carta "escondida" (de costas)
  let hiddenCardDiv = document.createElement("div");
  hiddenCardDiv.className = "card hidden-card";
  hiddenCardDiv.innerHTML = "🂠"; // Símbolo Unicode para costas de cartas
  dealerDiv.appendChild(hiddenCardDiv);

  debug(game); // Atualiza os dados de debug na interface
  updatePlayer(game.getGameState()); // Atualiza as pontuações do jogador e verifica estado inicial
}

// Atualiza a interface sempre que há uma ação da parte do jogador
function updatePlayer(state) {
  let pScore = document.getElementById("player-score");
  // Atualiza a pontuação visível do jogador
  if (state.playerScore !== undefined && pScore) {
    pScore.innerText = state.playerScore;
  }

  let dScore = document.getElementById("dealer-score");
  if (state.dealerScore !== undefined && dScore) {
    // Se ainda for a vez do jogador (dealer não revelou a carta e jogo não terminou), 
    // a pontuação do dealer mostrada é apenas o valor da sua única carta visível.
    if (game.dealerTurn === false && state.gameEnded === false) {
      let cartasDealer = game.getDealerCards();
      if (cartasDealer.length > 0) {
        dScore.innerText = game.getCardsValue([cartasDealer[0]]);
      }
    } else {
      // Se for a vez do dealer ou o jogo tiver acabado, mostra o valor total (duas ou mais cartas)
      dScore.innerText = state.dealerScore;
    }
  }

  // Verifica se o jogo terminou após a jogada do Player (ex: Player rebentou ou fez Blackjack)
  if (state.gameEnded) {
    finalizeButtons(); // Revela a carta do dealer e bloqueia a mesa
    finalScore(state); // Mostra quem ganhou
  }
}

// Atualiza a interface sempre que há uma ação da parte do dealer
function updateDealer(state) {
  let pScore = document.getElementById("player-score");
  if (state.playerScore !== undefined && pScore) {
    pScore.innerText = state.playerScore; // Garante que a pontuação do jogador se mantém
  }

  let dScore = document.getElementById("dealer-score");
  if (state.dealerScore !== undefined && dScore) {
    dScore.innerText = state.dealerScore; // Atualiza a pontuação total revelada do dealer
  }

  // Verifica se o dealer concluiu a sua jogada (ou porque atingiu a pontuação limite ou porque rebentou)
  if (state.gameEnded) {
    finalizeButtons();
    finalScore(state);
  }
}

// Ação executada quando o utilizador clica no botão "Card" (Pedir carta)
function playerNewCard() {
  let state = game.playerMove(); // Registra a jogada do jogador na lógica do jogo
  let pCards = game.getPlayerCards();
  let lastCard = pCards[pCards.length - 1]; // Obtém a nova carta gerada

  printCard(document.getElementById("player"), lastCard); // Adiciona e mostra a carta na mesa
  updatePlayer(state); // Atualiza os painéis de pontuação 
  debug(game);
}

// Ação interna do sistema usada pelo dealer para sacar uma nova carta
function dealerNewCard() {
  let state = game.dealerMove(); // Lógica saca uma carta
  let dCards = game.getDealerCards();
  let lastCard = dCards[dCards.length - 1]; // Obtém a nova carta do dealer

  printCard(document.getElementById("dealer"), lastCard); // Adiciona-a visualmente à mesa
  updateDealer(state);
  debug(game);
  return state; // Retorna o estado atual para o ciclo saber se precisa de continuar
}

// Ação executada quando o utilizador clica em "Stop" (Stand/Parar de jogar)
function dealerFinish() {
  // O jogador não pode fazer mais movimentos durante a vez do dealer
  document.getElementById("card").disabled = true;
  document.getElementById("stand").disabled = true;

  game.setDealerTurn(true); // Indica à lógica que é a vez do dealer jogar
  let state = game.getGameState();

  let dealerDiv = document.getElementById("dealer");
  let dCards = game.getDealerCards();

  // Transforma a carta escondida na verdadeira 2ª carta, revelando-a
  if (dealerDiv && dealerDiv.children[1] && dCards[1]) {
    printCard(dealerDiv.children[1], dCards[1], true);
  }

  // Atualiza imediatamente a pontuação visível total que o dealer já tem
  let dScore = document.getElementById("dealer-score");
  if (dScore) dScore.innerText = state.dealerScore;

  // Caso as duas cartas já resolvam o jogo logo na revelação
  if (state.gameEnded) {
    updateDealer(state);
    return;
  }

  // Função interna recursiva que gere o dealer a sacar cartas com um pequeno atraso (efeito animação)
  function tirarProximaCarta(estadoAtual) {
    if (!estadoAtual.gameEnded) {
      setTimeout(() => {
        let proximoEstado = dealerNewCard(); // O dealer saca mais uma carta
        tirarProximaCarta(proximoEstado);    // A função chama-se a si mesma recursivamente
      }, 1000); // Aguarda 1000 milissegundos (1 segundo) entre as cartas sacadas para dar tempo ao utilizador de ver
    }
  }

  tirarProximaCarta(state); // Arranca o processo das jogadas sucessivas do dealer
}

// Utilitário para construir os elementos HTML visuais de cada carta sacada na mesa
function printCard(element, card, replace = false) {
  if (!element || !card) return;

  // Monta o texto que vai dentro da carta combinando o valor (rank) e o naipe (suit) ex: "10♠" ou "A♥"
  const cardText = `${card.rank}${card.suit}`;
  
  // Condicional para verificar se o naipe é vermelho (Copas - Hearts ou Ouros - Diamonds)
  const isRed = card.suit === "♥" || card.suit === "♦";
  // Atribui uma classe CSS extra ("red-suit") que pinta o texto de vermelho se a condição for verdadeira
  const cardClass = isRed ? "card red-suit" : "card";

  // Se replace for true, estamos apenas a sobreescrever uma carta já existente (ex: a carta escondida)
  if (replace) {
    element.innerHTML = cardText;
    element.className = cardClass;
  } else {
    // Se replace for false, criamos dinamicamente uma nova tag DIV para adicionar a carta na mesa
    let cardDiv = document.createElement("div");
    cardDiv.className = cardClass;
    cardDiv.innerHTML = cardText;
    element.appendChild(cardDiv); // Acrescenta a nova div gerada à zona selecionada (jogador ou dealer)
  }
}