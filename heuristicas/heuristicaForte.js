function heuristicaForte(casaAtual, destino) {
  const mesmaLinha = casaAtual.linha === destino[0];
  const mesmaColuna = casaAtual.coluna === destino[1];

  if (mesmaLinha || mesmaColuna) {
    return 1; // chega em 1 movimento
  }

  return 2; // precisa de 2 movimentos (mínimo da torre)
}

module.exports = heuristicaForte;