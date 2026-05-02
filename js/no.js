class No {
  constructor(casa, pai = null) {
    this.casa = casa;     // Casa atual (posição no tabuleiro)
    this.pai = pai;       // Nó anterior (para reconstruir caminho)

    this.g = 0;           // custo do início até aqui
    this.h = 0;           // heurística (estimativa até o destino)
    this.f = 0;           // f(n) = g + h
  }
}

module.exports = No;