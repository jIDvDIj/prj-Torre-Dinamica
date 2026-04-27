function getVizinhos(tabuleiro, casaAtual) {
  const vizinhos = [];

  const direcoes = [
    [-1, 0], // cima
    [1, 0],  // baixo
    [0, -1], // esquerda
    [0, 1]   // direita
  ];

  for (const [di, dj] of direcoes) {
    const novaLinha = casaAtual.linha + di;
    const novaColuna = casaAtual.coluna + dj;

    // Verifica limites do tabuleiro
    if (
      novaLinha >= 0 && novaLinha < tabuleiro.length &&
      novaColuna >= 0 && novaColuna < tabuleiro[0].length
    ) {
      const vizinho = tabuleiro[novaLinha][novaColuna];

      // Verifica se não é barreira
      if (vizinho.custo !== Infinity) {
        vizinhos.push(vizinho);
      }
    }
  }

  return vizinhos;
}

module.exports = getVizinhos;