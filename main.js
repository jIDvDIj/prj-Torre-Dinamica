const getMovimentos = require("./js/movimento");
const { gerarTabuleiroComCaminho, imprimirTabuleiro } = require("./js/tabuleiro");

// 1. Gera o cenário
const resultado = gerarTabuleiroComCaminho();

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

movimentos.forEach(m => {
  console.log(
    `${m.direcao} → (${m.casa.linha}, ${m.casa.coluna}) | custo: ${m.casa.custo}`
  );
});