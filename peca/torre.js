const getVizinhos = require("./movimento");

class Torre {
  constructor(posicaoInicial) {
    this.posicao = posicaoInicial;
  }

  movimentosPossiveis(tabuleiro) {
    return getVizinhos(tabuleiro, this.posicao);
  }
}

module.exports = Torre;