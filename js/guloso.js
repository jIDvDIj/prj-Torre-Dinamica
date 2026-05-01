function guloso(tabuleiro, origem, destino, heuristica) {
  const startKey = `${origem[0]}-${origem[1]}`;
  const endKey = `${destino[0]}-${destino[1]}`;

  const visitados = new Set();
  const anterior = new Map();

  // Fila de prioridade simples: array ordenado por h(n)
  const fila = [{ casa: tabuleiro[origem[0]][origem[1]], h: 0 }];
  let nosExpandidos = 0;

  while (fila.length > 0) {
    // Ordena pelo menor h(n)
    fila.sort((a, b) => a.h - b.h);
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

      anterior.set(vKey, key);
      fila.push({ casa: vizinho, h: heuristica(vizinho, destino) });
    }
  }

  const caminho = reconstruirCaminho(anterior, startKey, endKey);
  const custoTotal = caminho
    ? caminho.slice(1).reduce((acc, [l, c]) => acc + tabuleiro[l][c].custo, 0)
    : null;

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

  return null; // destino inalcançável
}

module.exports = guloso;
