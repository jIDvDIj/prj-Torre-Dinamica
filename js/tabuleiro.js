
const TAM = 8;

const TERRENOS = ["estrada", "terra", "lama", "barreira"];

const CUSTOS = {
  estrada: 1,
  terra: 3,
  lama: 5,
  barreira: Infinity
};

// 🔹 Nova classe
class Casa {
  constructor(linha, coluna, tipo, custo) {
    this.linha = linha;
    this.coluna = coluna;
    this.tipo = tipo;
    this.custo = custo;
  }
}

function converterParaXadrez(linha, coluna) {
  const letras = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const numero = 8 - linha;

  return `${letras[coluna]}${numero}`;
}


function criarCaminho(origem, destino) {
  const caminho = [];

  let [i, j] = origem;

  while (i !== destino[0]) {
    caminho.push([i, j]);
    i += i < destino[0] ? 1 : -1;
  }

  while (j !== destino[1]) {
    caminho.push([i, j]);
    j += j < destino[1] ? 1 : -1;
  }

  caminho.push(destino);

  return caminho;
}

function gerarTabuleiroAleatorio() {
  const matriz = [];

  const origem = [rand(), rand()];
  let destino;

  do {
    destino = [rand(), rand()];
  } while (origem[0] === destino[0] && origem[1] === destino[1]);

  for (let i = 0; i < TAM; i++) {
    const linha = [];

    for (let j = 0; j < TAM; j++) {
      let tipo;

      // 🔥 NÃO deixa origem/destino serem barreira
      if (
        (i === origem[0] && j === origem[1]) ||
        (i === destino[0] && j === destino[1])
      ) {
        tipo = "estrada";
      } else {
        // 🔥 controla chance de barreira
        const r = Math.random();

        if (r < 0.2) tipo = "barreira";     // 20%
        else if (r < 0.5) tipo = "lama";    // 30%
        else if (r < 0.8) tipo = "terra";   // 30%
        else tipo = "estrada";              // 20%
      }

      const custo = CUSTOS[tipo];
      linha.push(new Casa(i, j, tipo, custo));
    }

    matriz.push(linha);
  }

  return { matriz, origem, destino };
}

function rand() {
  return Math.floor(Math.random() * TAM);
}


// 🔹 Imprime no terminal
function imprimirTabuleiro(tabuleiro, origem, destino) {
  console.log("\nTABULEIRO:\n");

  for (let i = 0; i < TAM; i++) {
    let linhaStr = "";

    for (let j = 0; j < TAM; j++) {

      if (i === origem[0] && j === origem[1]) {
        linhaStr += " ♜ ";
      } 
      else if (i === destino[0] && j === destino[1]) {
        linhaStr += " 🎯 ";
      } 
      else {
        const tipo = tabuleiro[i][j].tipo;

        switch (tipo) {
          case "estrada":
            linhaStr += " . ";
            break;
          case "terra":
            linhaStr += " t ";
            break;
          case "lama":
            linhaStr += " m ";
            break;
          case "barreira":
            linhaStr += " X ";
            break;
        }
      }

    }

    console.log(linhaStr);
  }

  console.log("\nLegenda:");
  console.log("♜ = origem");
  console.log("🎯 = destino");
  console.log(". = estrada (1)");
  console.log("t = terra (3)");
  console.log("m = lama (5)");
  console.log("X = barreira\n");
}


module.exports = {
  gerarTabuleiroAleatorio,
  imprimirTabuleiro,
  converterParaXadrez
};