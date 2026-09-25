// Definição da classe principal que contém toda a lógica do jogo Blackjack
class Blackjack {
  // Constantes estáticas da classe
  static MAX_POINTS = 25; // Pontuação máxima permitida antes de rebentar (nesta variante é 25 em vez de 21)
  static DEALER_MAX_TURN_POINTS = 21; // Pontuação a partir da qual o dealer se sente "seguro" para manter ou avaliar empate

  // O construtor é executado sempre que se cria um novo jogo (new Blackjack())
  constructor() {
    this.dealerCards = []; // Array que guarda as cartas na mão do Dealer
    this.playerCards = []; // Array que guarda as cartas na mão do Player
    this.dealerTurn = false; // Booleano que indica se é a vez do Dealer jogar
    
    // Objeto que armazena o estado atual da partida
    this.state = {
      gameEnded: false,     // Indica se a partida terminou
      playerWon: false,     // Indica se o jogador venceu
      dealerWon: false,     // Indica se o dealer venceu
      playerBusted: false,  // Indica se o jogador ultrapassou os pontos máximos (rebentou)
      dealerBusted: false,  // Indica se o dealer ultrapassou os pontos máximos (rebentou)
    };
    
    // Inicializa o baralho criando um novo, baralhando-o e guardando na variável da classe
    this.deck = this.shuffle(this.newDeck());
  }

  // Método que gera um baralho de cartas completo (52 cartas)
  newDeck() {
    const suits = ["♥", "♦", "♣", "♠"]; // Os 4 naipes (Copas, Ouros, Paus, Espadas)
    // Os 13 valores (Cartas numéricas e figuras: Valete, Dama, Rei, Ás)
    const ranks = [
      "2", "3", "4", "5", "6", "7", "8", "9", "10",
      "J", "Q", "K", "A"
    ];
    const deck = []; // Array temporário para construir o baralho
    
    // Dois ciclos (loops) para combinar cada naipe com cada valor existente
    for (let suit of suits) {
      for (let rank of ranks) {
        deck.push({ suit, rank }); // Adiciona a carta como um objeto (ex: {suit: "♠", rank: "A"}) ao baralho
      }
    }
    return deck; // Devolve o baralho ordenado
  }

  // Método que baralha o deck recebido (usando o algoritmo de Fisher-Yates)
  shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      // Gera um índice aleatório entre 0 e i
      const j = Math.floor(Math.random() * (i + 1));
      // Troca a carta na posição i com a carta na posição j
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck; // Devolve o baralho baralhado
  }

  // Método para obter as cartas atuais do dealer
  getDealerCards() {
    return this.dealerCards.slice(); // Retorna uma cópia do array (slice) por segurança, para não ser alterado fora da classe
  }

  // Método para obter as cartas atuais do jogador
  getPlayerCards() {
    return this.playerCards.slice(); // Retorna uma cópia do array
  }

  // Define se é a vez do dealer jogar
  setDealerTurn(val) {
    this.dealerTurn = val; // Recebe true ou false
  }

  // Calcula a pontuação total de um conjunto de cartas (mão)
  getCardsValue(cards) {
    let value = 0; // Valor total da mão
    let aces = 0;  // Contador de Ases (pois o Ás pode valer 1 ou 11)
    
    // Avalia o valor de cada carta na mão
    for (let card of cards) {
      if (["J", "Q", "K"].includes(card.rank)) {
        value += 10; // As figuras (Valete, Dama, Rei) valem 10 pontos
      } else if (card.rank === "A") {
        value += 11; // O Ás vale inicialmente 11 pontos
        aces += 1;   // Regista que temos um Ás
      } else {
        value += parseInt(card.rank); // Cartas numéricas valem o seu próprio valor (convertido de texto para número inteiro)
      }
    }
    
    // Se a pontuação ultrapassar o limite máximo e houver ases na mão:
    while (value > Blackjack.MAX_POINTS && aces > 0) {
      value -= 10; // O Ás passa a valer 1 em vez de 11 (subtrai-se 10 pontos ao total)
      aces -= 1;   // Subtrai um Ás da contagem de ases disponíveis para ajuste
    }
    
    return value; // Devolve a pontuação final calculada
  }

  // O Dealer tira uma carta do baralho
  dealerMove() {
    if (this.deck.length > 0) {
      this.dealerCards.push(this.deck.pop()); // pop() retira a última carta do baralho e push() adiciona à mão do dealer
    }
    return this.getGameState(); // Devolve o novo estado do jogo após a jogada
  }

  // O Jogador tira uma carta do baralho
  playerMove() {
    if (this.deck.length > 0) {
      this.playerCards.push(this.deck.pop()); // Adiciona a carta do topo do baralho à mão do jogador
    }
    return this.getGameState(); // Devolve o novo estado do jogo
  }

  // Avalia todas as condições da partida e atualiza o estado
  getGameState() {
    // Calcula as pontuações atualizadas de ambos
    const playerPts = this.getCardsValue(this.playerCards);
    const dealerPts = this.getCardsValue(this.dealerCards);

    // Guarda as pontuações no objeto de estado
    this.state.playerScore = playerPts;
    this.state.dealerScore = dealerPts;

    // Verifica se alguém ultrapassou a pontuação máxima (rebentou)
    this.state.playerBusted = playerPts > Blackjack.MAX_POINTS;
    this.state.dealerBusted = dealerPts > Blackjack.MAX_POINTS;

    // Lógica para determinar vitória, derrota ou continuidade do jogo
    if (this.state.playerBusted) {
      // Se o jogador rebentou, o jogo acaba e o dealer vence
      this.state.gameEnded = true;
      this.state.dealerWon = true;
      this.state.playerWon = false;
    } else if (this.state.dealerBusted) {
      // Se o dealer rebentou, o jogo acaba e o jogador vence
      this.state.gameEnded = true;
      this.state.playerWon = true;
      this.state.dealerWon = false;
    } else if (this.dealerTurn) {
      // Quando é a vez do Dealer: O Dealer para se ultrapassar o Player, OU se estiver empatado num valor seguro (ex: >= 21)
      if (
        dealerPts > playerPts ||
        (dealerPts === playerPts &&
          dealerPts >= Blackjack.DEALER_MAX_TURN_POINTS)
      ) {
        this.state.gameEnded = true; // Termina a partida
        
        if (dealerPts > playerPts) {
          // Dealer tem mais pontos, dealer vence
          this.state.dealerWon = true;
          this.state.playerWon = false;
        } else if (playerPts > dealerPts) {
          // Jogador tem mais pontos, jogador vence (condição pouco provável aqui dada a lógica anterior, mas funciona como segurança)
          this.state.playerWon = true;
          this.state.dealerWon = false;
        } else {
          // Empate (ambos têm a mesma pontuação e dealer decidiu parar)
          this.state.dealerWon = false;
          this.state.playerWon = false;
        }
      }
    }
    
    // Retorna o objeto de estado com todas as atualizações
    return this.state;
  }
}