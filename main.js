const getVizinhos = require("./movimento");
require('./js/movimento')
require('./js/tabuleiro')


// depois de gerar o tabuleiro
const casaInicial = matriz[origem[0]][origem[1]];

const vizinhos = getVizinhos(matriz, casaInicial);

console.log("\nVizinhos da origem:");
vizinhos.forEach(v => {
  console.log(`(${v.linha}, ${v.coluna}) - custo: ${v.custo}`);
});