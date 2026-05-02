const No = require("../js/no");
const getMovimentos = require("../js/movimento");

function aEstrela(tabuleiro, origem, destino, heuristica) {
  const listaAberta = [];
  const listaFechada = new Set();

  const noInicial = new No(tabuleiro[origem[0]][origem[1]]);
  noInicial.g = 0;
  noInicial.h = heuristica(noInicial.casa, destino);
  noInicial.f = noInicial.g + noInicial.h;

  listaAberta.push(noInicial);

  while (listaAberta.length > 0) {
    // 🔥 Ordena pelo menor f(n)
    listaAberta.sort((a, b) => a.f - b.f);

    const atual = listaAberta.shift();

    const chaveAtual = `${atual.casa.linha}-${atual.casa.coluna}`;

    if (listaFechada.has(chaveAtual)) continue;
    listaFechada.add(chaveAtual);

    // 🎯 Chegou no destino
    if (
      atual.casa.linha === destino[0] &&
      atual.casa.coluna === destino[1]
    ) {
      return {
        caminho: reconstruirCaminho(atual),
        nosExpandidos: listaFechada
      };
    }

    const movimentos = getMovimentos(tabuleiro, atual.casa);

    for (const mov of movimentos) {
      const vizinho = mov.casa;

      const chaveVizinho = `${vizinho.linha}-${vizinho.coluna}`;

      if (listaFechada.has(chaveVizinho)) continue;

      const custoMovimento = vizinho.custo;

      const novoNo = new No(vizinho, atual);

      novoNo.g = atual.g + custoMovimento;
      novoNo.h = heuristica(vizinho, destino);
      novoNo.f = novoNo.g + novoNo.h;

      // 🔍 Verifica se já existe na lista aberta com custo menor
      const existente = listaAberta.find(n =>
        n.casa.linha === vizinho.linha &&
        n.casa.coluna === vizinho.coluna
      );

      if (existente && existente.g <= novoNo.g) {
        continue;
      }

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

module.exports = aEstrela;