function getMovimentos(tabuleiro, casa) {
  const movimentos = [];

  const direcoes = [
    { dx: -1, dy: 0, nome: "cima" },
    { dx: 1, dy: 0, nome: "baixo" },
    { dx: 0, dy: -1, nome: "esquerda" },
    { dx: 0, dy: 1, nome: "direita" }
  ];

  for (const dir of direcoes) {
    let i = casa.linha + dir.dx;
    let j = casa.coluna + dir.dy;

    // 🔥 continua andando até bater em obstáculo
    while (
      i >= 0 && i < tabuleiro.length &&
      j >= 0 && j < tabuleiro.length
    ) {
      const proximaCasa = tabuleiro[i][j];

      // para se for barreira
      if (proximaCasa.tipo === "barreira") break;

      movimentos.push({
        casa: proximaCasa,
        direcao: dir.nome
      });

      // continua na mesma direção
      i += dir.dx;
      j += dir.dy;
    }
  }

  return movimentos;
}

module.exports = getMovimentos;