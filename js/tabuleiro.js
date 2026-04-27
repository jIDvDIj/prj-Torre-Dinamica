
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

function gerarTabuleiroComCaminho() {
  const matriz = [];

  const origem = [rand(), rand()];
  let destino;

  do {
    destino = [rand(), rand()];
  } while (origem[0] === destino[0] && origem[1] === destino[1]);

  const caminho = criarCaminho(origem, destino);

  const caminhoSet = new Set(caminho.map(([x, y]) => `${x}-${y}`));

for (let i = 0; i < TAM; i++) {
  const linha = [];

  for (let j = 0; j < TAM; j++) {
    let tipo;

    if (caminhoSet.has(`${i}-${j}`)) {
      tipo = "estrada";
    } else {
      tipo = TERRENOS[Math.floor(Math.random() * TERRENOS.length)];
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


