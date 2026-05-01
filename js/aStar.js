function aStar(tabuleiro, origem, destino, heuristica) {
  const startKey = `${origem[0]}-${origem[1]}`;
  const endKey = `${destino[0]}-${destino[1]}`;

  const visitados = new Set();
  const anterior = new Map();
  const gCusto = new Map();

  gCusto.set(startKey, 0);

  // Fila de prioridade simples: array ordenado por f(n) = g(n) + h(n)
  const fila = [{
    casa: tabuleiro[origem[0]][origem[1]],
    f: heuristica(tabuleiro[origem[0]][origem[1]], destino)
  }];
  let nosExpandidos = 0;

  while (fila.length > 0) {
    fila.sort((a, b) => a.f - b.f);
    const { casa } = fila.shift();
    const key = `${casa.linha}-${casa.coluna}`;

    if (visitados.has(key)) continue;
    visitados.add(key);
    nosExpandidos++;

    if (key === endKey) break;

    const direcoes = [
      { di: -1, dj: 0 }, { di: 1, dj: 0 },
      { di: 0, dj: -1 }, { di: 0, dj: 1 }
    ];

    for (const { di, dj } of direcoes) {
      const nl = casa.linha + di;
      const nc = casa.coluna + dj;

      if (nl < 0 || nl >= tabuleiro.length || nc < 0 || nc >= tabuleiro[0].length) continue;

      const vizinho = tabuleiro[nl][nc];
      const vKey = `${nl}-${nc}`;

      if (visitados.has(vKey) || vizinho.custo === Infinity) continue;

      const novoG = gCusto.get(key) + vizinho.custo;

      if (novoG < (gCusto.get(vKey) ?? Infinity)) {
        gCusto.set(vKey, novoG);
        anterior.set(vKey, key);
        fila.push({ casa: vizinho, f: novoG + heuristica(vizinho, destino) });
      }
    }
  }

  const caminho = reconstruirCaminho(anterior, startKey, endKey);
  const custoTotal = gCusto.get(endKey) ?? null;

  return { caminho, nosExpandidos, custoTotal };
}

function reconstruirCaminho(anterior, startKey, endKey) {
  const caminho = [];
  let atual = endKey;

  while (atual && atual !== startKey) {
    const [l, c] = atual.split("-").map(Number);
    caminho.unshift([l, c]);
    atual = anterior.get(atual);
  }

  if (atual === startKey) {
    const [l, c] = startKey.split("-").map(Number);
    caminho.unshift([l, c]);
    return caminho;
  }

  return null;
}

module.exports = aStar;
