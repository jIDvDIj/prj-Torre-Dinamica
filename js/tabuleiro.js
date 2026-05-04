
const TAM = 8;

const TERRENOS = ["estrada", "neve", "terra", "areia", "lama", "floresta", "barreira"];

const CUSTOS = {
  estrada:  1,
  neve:     2,
  terra:    3,
  areia:    4,
  lama:     5,
  floresta: 7,
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
  } while (Math.abs(origem[0] - destino[0]) + Math.abs(origem[1] - destino[1]) < 4);

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

        if      (r < 0.15) tipo = "barreira";  // 15%
        else if (r < 0.30) tipo = "floresta";  // 15%
        else if (r < 0.45) tipo = "lama";      // 15%
        else if (r < 0.60) tipo = "areia";     // 15%
        else if (r < 0.75) tipo = "terra";     // 15%
        else if (r < 0.88) tipo = "neve";      // 13%
        else               tipo = "estrada";   // 12%
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
          case "estrada":  linhaStr += " . "; break;
          case "neve":     linhaStr += " n "; break;
          case "terra":    linhaStr += " t "; break;
          case "areia":    linhaStr += " a "; break;
          case "lama":     linhaStr += " m "; break;
          case "floresta": linhaStr += " f "; break;
          case "barreira": linhaStr += " X "; break;
        }
      }

    }

    console.log(linhaStr);
  }

  console.log("\nLegenda:");
  console.log("♜ = origem");
  console.log("🎯 = destino");
  console.log(". = estrada  (custo 1)");
  console.log("n = neve     (custo 2)");
  console.log("t = terra    (custo 3)");
  console.log("a = areia    (custo 4)");
  console.log("m = lama     (custo 5)");
  console.log("f = floresta (custo 7)");
  console.log("X = barreira (bloqueio)\n");
}


function gerarTabuleiroComCaminho() {
  const { matriz, origem, destino } = gerarTabuleiroAleatorio();
  const caminho = criarCaminho(origem, destino);
  for (const [i, j] of caminho) {
    matriz[i][j].tipo = "estrada";
    matriz[i][j].custo = CUSTOS["estrada"];
  }
  return { matriz, origem, destino };
}

module.exports = {
  gerarTabuleiroAleatorio,
  gerarTabuleiroComCaminho,
  imprimirTabuleiro,
  converterParaXadrez
};