function heuristicaManhattan(casaAtual, destino) {
  const dx = Math.abs(casaAtual.linha - destino[0]);
  const dy = Math.abs(casaAtual.coluna - destino[1]);

  return dx + dy;
}

module.exports = heuristicaManhattan;