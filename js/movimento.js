function getMovimentos(tabuleiro, casaAtual) {
  const movimentos = [];

  const direcoes = [
    { nome: "cima", di: -1, dj: 0 },
    { nome: "baixo", di: 1, dj: 0 },
    { nome: "esquerda", di: 0, dj: -1 },
    { nome: "direita", di: 0, dj: 1 }
  ];

  for (const dir of direcoes) {
    const novaLinha = casaAtual.linha + dir.di;
    const novaColuna = casaAtual.coluna + dir.dj;

    if (
      novaLinha >= 0 && novaLinha < tabuleiro.length &&
      novaColuna >= 0 && novaColuna < tabuleiro[0].length
    ) {
      const vizinho = tabuleiro[novaLinha][novaColuna];

      if (vizinho.custo !== Infinity) {
        movimentos.push({
          casa: vizinho,
          direcao: dir.nome
        });
      }
    }
  }

  return movimentos;
}

module.exports = getMovimentos;