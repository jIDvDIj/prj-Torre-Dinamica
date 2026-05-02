const getMovimentos = require("./js/movimento");
const No = require("./js/no");
const heuristicaForte = require("./heuristicas/heuristicaForte");
const heuristicaFraca = require("./heuristicas/heuristicaFraca");
const buscaGulosa = require("./buscas/gulosa");
const aEstrela = require("./buscas/aestrela");
const {
  gerarTabuleiroAleatorio,
  imprimirTabuleiro,
  converterParaXadrez
} = require("./js/tabuleiro");



// 1. Gera o cenário
const resultado = gerarTabuleiroAleatorio();

const matriz = resultado.matriz;
const origem = resultado.origem;
const destino = resultado.destino;

// 2. Imprime o tabuleiro
imprimirTabuleiro(matriz, origem, destino);

// 3. Define a casa inicial
const casaInicial = matriz[origem[0]][origem[1]];

// 4. Calcula movimentos
const movimentos = getMovimentos(matriz, casaInicial);

// 5. Mostra resultados
console.log("\nMovimentos possíveis da torre:");

const hForte = heuristicaForte(casaInicial, destino);
const hFraca = heuristicaFraca(casaInicial, destino);

const noInicial = new No(casaInicial);

console.log("\nHeurísticas:");
console.log("Forte:", hForte);
console.log("Fraca:", hFraca);

console.log("\nNó inicial:");
console.log({
  posicao: converterParaXadrez(casaInicial.linha, casaInicial.coluna),
  g: noInicial.g,
  h: noInicial.h,
  f: noInicial.f
});

const caminho = buscaGulosa(matriz, origem, destino, heuristicaForte);

console.log("\nCaminho encontrado (Gulosa):");

if (caminho) {
  caminho.forEach(c => {
    const pos = converterParaXadrez(c.linha, c.coluna);
    console.log(pos);
  });
} else {
  console.log("Nenhum caminho encontrado");
}

const resultadoA = aEstrela(matriz, origem, destino, heuristicaForte);

console.log("\nCaminho encontrado (A*):");

if (resultadoA) {
  resultadoA.caminho.forEach(c => {
    const pos = converterParaXadrez(c.linha, c.coluna);
    console.log(pos);
  });

  console.log("\nNós expandidos:", resultadoA.nosExpandidos.size);
} else {
  console.log("Nenhum caminho encontrado");
}

movimentos.forEach(m => {
  const pos = converterParaXadrez(m.casa.linha, m.casa.coluna);

  console.log(
    `${m.direcao} → ${pos} | custo: ${m.casa.custo}`
  );
});

