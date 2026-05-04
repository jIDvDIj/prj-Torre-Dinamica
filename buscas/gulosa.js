const No = require("../js/no");
const getMovimentos = require("../js/movimento");

function buscaGulosa(tabuleiro, origem, destino, heuristica) {
  const listaAberta = [];
  const visitados = new Set();

  const noInicial = new No(tabuleiro[origem[0]][origem[1]]);
  noInicial.h = heuristica(noInicial.casa, destino);
  noInicial.f = noInicial.h;

  listaAberta.push(noInicial);

  while (listaAberta.length > 0) {
    //  Ordena pelo menor h(n)
    listaAberta.sort((a, b) => a.h - b.h);

    const atual = listaAberta.shift();

    const chave = `${atual.casa.linha}-${atual.casa.coluna}`;

    if (visitados.has(chave)) continue;
    visitados.add(chave);

    // 🎯 Chegou no destino
    if (
      atual.casa.linha === destino[0] &&
      atual.casa.coluna === destino[1]
    ) {
      return reconstruirCaminho(atual);
    }

    const movimentos = getMovimentos(tabuleiro, atual.casa);

    for (const mov of movimentos) {
      const vizinho = mov.casa;

      const chaveVizinho = `${vizinho.linha}-${vizinho.coluna}`;

      if (visitados.has(chaveVizinho)) continue;

      const novoNo = new No(vizinho, atual);

      novoNo.h = heuristica(vizinho, destino);
      novoNo.f = novoNo.h;

      listaAberta.push(novoNo);
    }
  }

  return null; // não encontrou caminho
}

// 🔁 Reconstrói o caminho final
function reconstruirCaminho(no) {
  const caminho = [];

  let atual = no;

  while (atual !== null) {
    caminho.push(atual.casa);
    atual = atual.pai;
  }

  return caminho.reverse();
}

module.exports = buscaGulosa;