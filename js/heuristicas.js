// Heurística Forte: Distância Euclidiana até o destino
function heuristicaForte(casa, destino) {
  const dl = destino[0] - casa.linha;
  const dc = destino[1] - casa.coluna;
  return Math.sqrt(dl * dl + dc * dc);
}

// Heurística Fraca: Distância de Manhattan dividida por 10 (subestima muito)
function heuristicaFraca(casa, destino) {
  return (Math.abs(destino[0] - casa.linha) + Math.abs(destino[1] - casa.coluna)) / 10;
}

module.exports = { heuristicaForte, heuristicaFraca };
