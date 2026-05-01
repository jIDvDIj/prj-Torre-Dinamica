const { gerarTabuleiroComCaminho, imprimirTabuleiro } = require("./js/tabuleiro");
const { rodarComparacao, imprimirRelatorio } = require("./js/comparar");

// Exibe um tabuleiro de exemplo
const { matriz, origem, destino } = gerarTabuleiroComCaminho();
imprimirTabuleiro(matriz, origem, destino);
console.log(`Origem: (${origem[0]}, ${origem[1]})  →  Destino: (${destino[0]}, ${destino[1]})`);

// Roda a comparação e imprime o relatório
const resultado = rodarComparacao();
imprimirRelatorio(resultado);
