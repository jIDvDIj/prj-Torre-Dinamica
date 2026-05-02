// ── Tabuleiro ────────────────────────────────────────────────────────────────

const TAM = 8;
const CUSTOS = {
  comum: 1,
  gelo:  Infinity,
};

class Casa {
  constructor(linha, coluna, tipo) {
    this.linha  = linha;
    this.coluna = coluna;
    this.tipo   = tipo;
    this.custo  = CUSTOS[tipo];
  }
}

function rand() {
  return Math.floor(Math.random() * TAM);
}

function gerarTabuleiro() {
  const origem = [rand(), rand()];
  let destino;
  do { destino = [rand(), rand()]; }
  while (origem[0] === destino[0] && origem[1] === destino[1]);

  const protegidas = new Set([
    `${origem[0]}-${origem[1]}`,
    `${destino[0]}-${destino[1]}`,
  ]);

  // Todas as células começam como comum
  const matriz = [];
  for (let i = 0; i < TAM; i++) {
    const linha = [];
    for (let j = 0; j < TAM; j++)
      linha.push(new Casa(i, j, "comum"));
    matriz.push(linha);
  }

  adicionarGelo(matriz, protegidas, [], 5, origem, destino);

  return { matriz, origem, destino, turno: 0, ultimoCaminho: [] };
}

// ── Dinamismo ─────────────────────────────────────────────────────────────────

// Retorna true se ainda há caminho, false se o nível ficou bloqueado
function evoluirTabuleiro(matriz, origem, destino, ultimoCaminho = []) {
  const protegidas = new Set([
    `${origem[0]}-${origem[1]}`,
    `${destino[0]}-${destino[1]}`,
  ]);

  adicionarGelo(matriz, protegidas, ultimoCaminho, 5, origem, destino);

  return existeCaminho(matriz, origem, destino);
}

function adicionarGelo(matriz, protegidas, caminho, quantidade, origem, destino) {
  const gelarSeguro = (casa) => {
    // Testa o bloqueio antes de confirmar
    casa.tipo  = "gelo";
    casa.custo = Infinity;
    if (!existeCaminho(matriz, origem, destino)) {
      // Reverte — essa célula não pode ser bloqueada
      casa.tipo  = "comum";
      casa.custo = CUSTOS.comum;
      return false;
    }
    return true;
  };

  // Candidatos do caminho anterior que ainda são comuns
  const doCaminho = caminho.filter(([l, c]) =>
    !protegidas.has(`${l}-${c}`) && matriz[l][c].tipo === "comum"
  );

  let restantes = quantidade;

  // Tenta colocar 1 no caminho anterior
  if (doCaminho.length > 0) {
    embaralhar(doCaminho);
    for (const [l, c] of doCaminho) {
      if (gelarSeguro(matriz[l][c])) { restantes--; break; }
    }
  }

  // Preenche o restante com células comuns aleatórias
  const livres = [];
  for (let i = 0; i < TAM; i++)
    for (let j = 0; j < TAM; j++)
      if (!protegidas.has(`${i}-${j}`) && matriz[i][j].tipo === "comum")
        livres.push(matriz[i][j]);

  embaralhar(livres);
  let adicionados = 0;
  for (const casa of livres) {
    if (adicionados >= restantes) break;
    if (gelarSeguro(casa)) adicionados++;
  }
}

function existeCaminho(matriz, origem, destino) {
  const endKey   = `${destino[0]}-${destino[1]}`;
  const visitados = new Set([`${origem[0]}-${origem[1]}`]);
  const fila      = [[...origem]];

  while (fila.length > 0) {
    const [l, c] = fila.shift();
    if (`${l}-${c}` === endKey) return true;
    for (const [dl, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nl = l + dl, nc = c + dc;
      if (nl < 0 || nl >= TAM || nc < 0 || nc >= TAM) continue;
      const key = `${nl}-${nc}`;
      if (visitados.has(key) || matriz[nl][nc].custo === Infinity) continue;
      visitados.add(key);
      fila.push([nl, nc]);
    }
  }
  return false;
}

function embaralhar(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ── Heurísticas ───────────────────────────────────────────────────────────────

// Forte: 1 se já está na mesma linha ou coluna, 2 caso contrário (mínimo real da torre)
function heuristicaForte(casa, destino) {
  if (casa.linha === destino[0] || casa.coluna === destino[1]) return 1;
  return 2;
}

// Fraca: h(n) = 0 — degenera em Dijkstra, expande muito mais nós
function heuristicaFraca(casa, destino) {
  return 0;
}

// ── A* ────────────────────────────────────────────────────────────────────────

function aStar(tabuleiro, origem, destino, heuristica) {
  const startKey = `${origem[0]}-${origem[1]}`;
  const endKey   = `${destino[0]}-${destino[1]}`;
  const visitados = new Set();
  const anterior  = new Map();
  const gCusto    = new Map([[startKey, 0]]);
  const fila      = [{ casa: tabuleiro[origem[0]][origem[1]], f: heuristica(tabuleiro[origem[0]][origem[1]], destino) }];
  let nosExpandidos = 0;

  while (fila.length > 0) {
    fila.sort((a, b) => a.f - b.f);
    const { casa } = fila.shift();
    const key = `${casa.linha}-${casa.coluna}`;
    if (visitados.has(key)) continue;
    visitados.add(key);
    nosExpandidos++;
    if (key === endKey) break;

    for (const [di, dj] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nl = casa.linha + di, nc = casa.coluna + dj;
      if (nl < 0 || nl >= TAM || nc < 0 || nc >= TAM) continue;
      const viz  = tabuleiro[nl][nc];
      const vKey = `${nl}-${nc}`;
      if (visitados.has(vKey) || viz.custo === Infinity) continue;
      const novoG = gCusto.get(key) + viz.custo;
      if (novoG < (gCusto.get(vKey) ?? Infinity)) {
        gCusto.set(vKey, novoG);
        anterior.set(vKey, key);
        fila.push({ casa: viz, f: novoG + heuristica(viz, destino) });
      }
    }
  }

  const caminho = reconstruirCaminho(anterior, startKey, endKey);
  return { caminho, nosExpandidos, custoTotal: gCusto.get(endKey) ?? null, visitados: [...visitados] };
}

// ── Guloso ────────────────────────────────────────────────────────────────────

function guloso(tabuleiro, origem, destino, heuristica) {
  const startKey = `${origem[0]}-${origem[1]}`;
  const endKey   = `${destino[0]}-${destino[1]}`;
  const visitados = new Set();
  const anterior  = new Map();
  const fila      = [{ casa: tabuleiro[origem[0]][origem[1]], h: 0 }];
  let nosExpandidos = 0;

  while (fila.length > 0) {
    fila.sort((a, b) => a.h - b.h);
    const { casa } = fila.shift();
    const key = `${casa.linha}-${casa.coluna}`;
    if (visitados.has(key)) continue;
    visitados.add(key);
    nosExpandidos++;
    if (key === endKey) break;

    for (const [di, dj] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nl = casa.linha + di, nc = casa.coluna + dj;
      if (nl < 0 || nl >= TAM || nc < 0 || nc >= TAM) continue;
      const viz  = tabuleiro[nl][nc];
      const vKey = `${nl}-${nc}`;
      if (visitados.has(vKey) || viz.custo === Infinity) continue;
      anterior.set(vKey, key);
      fila.push({ casa: viz, h: heuristica(viz, destino) });
    }
  }

  const caminho = reconstruirCaminho(anterior, startKey, endKey);
  const custoTotal = caminho
    ? caminho.slice(1).reduce((acc, [l, c]) => acc + tabuleiro[l][c].custo, 0)
    : null;

  return { caminho, nosExpandidos, custoTotal, visitados: [...visitados] };
}

// ── Utilitários ───────────────────────────────────────────────────────────────

function reconstruirCaminho(anterior, startKey, endKey) {
  const caminho = [];
  let atual = endKey;
  while (atual && atual !== startKey) {
    caminho.unshift(atual.split("-").map(Number));
    atual = anterior.get(atual);
  }
  if (atual === startKey) {
    caminho.unshift(startKey.split("-").map(Number));
    return caminho;
  }
  return null;
}

function calcularCustoOtimo(matriz, origem, destino) {
  return aStar(matriz, origem, destino, heuristicaForte).custoTotal;
}
