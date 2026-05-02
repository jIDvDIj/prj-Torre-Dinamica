function getMovimentos(tabuleiro, casa) {
  const movimentos = [];

  const direcoes = [
    { dx: -1, dy: 0, nome: "cima" },
    { dx: 1, dy: 0, nome: "baixo" },
    { dx: 0, dy: -1, nome: "esquerda" },
    { dx: 0, dy: 1, nome: "direita" }
  ];

  for (const dir of direcoes) {
    const i = casa.linha + dir.dx;
    const j = casa.coluna + dir.dy;

    // verifica se está dentro do tabuleiro
    if (
      i >= 0 && i < tabuleiro.length &&
      j >= 0 && j < tabuleiro.length
    ) {
      const proximaCasa = tabuleiro[i][j];

      // ignora barreira
      if (proximaCasa.tipo !== "barreira") {
        movimentos.push({
          casa: proximaCasa,
          direcao: dir.nome
        });
      }
    }
  }

  return movimentos;
}

module.exports = getMovimentos;