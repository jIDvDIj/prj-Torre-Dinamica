const { gerarTabuleiroComCaminho } = require("./tabuleiro");
const { heuristicaForte, heuristicaFraca } = require("./heuristicas");
const guloso = require("./guloso");
const aStar = require("./aStar");

const RODADAS = 20;

const combinacoes = [
  { nome: "A* + H.Forte",     algo: aStar,  h: heuristicaForte },
  { nome: "A* + H.Fraca",     algo: aStar,  h: heuristicaFraca },
  { nome: "Guloso + H.Forte", algo: guloso, h: heuristicaForte },
  { nome: "Guloso + H.Fraca", algo: guloso, h: heuristicaFraca },
];

function rodarComparacao() {
  // Acumuladores por combinação
  const acumulado = combinacoes.map(() => ({
    totalNos: 0,
    totalCusto: 0,
    totalTempo: 0,
    achouOtimo: 0,
    falhou: 0,
  }));

  // Detalhes de cada rodada para exibição
  const rodadas = [];

  for (let r = 0; r < RODADAS; r++) {
    const { matriz, origem, destino } = gerarTabuleiroComCaminho();

    // Custo ótimo da rodada = resultado do A* com H.Forte (referência)
    const ref = aStar(matriz, origem, destino, heuristicaForte);
    const custoOtimo = ref.custoTotal;

    const linha = { rodada: r + 1, origem, destino, custoOtimo, resultados: [] };

    for (let i = 0; i < combinacoes.length; i++) {
      const { algo, h } = combinacoes[i];
      const t0 = performance.now();
      const res = algo(matriz, origem, destino, h);
      const tempo = performance.now() - t0;

      acumulado[i].totalNos   += res.nosExpandidos;
      acumulado[i].totalTempo += tempo;

      if (res.caminho && res.custoTotal !== null) {
        acumulado[i].totalCusto += res.custoTotal;
        if (res.custoTotal === custoOtimo) acumulado[i].achouOtimo++;
      } else {
        acumulado[i].falhou++;
      }

      linha.resultados.push({
        nos: res.nosExpandidos,
        custo: res.custoTotal,
        tempo: tempo.toFixed(3),
        otimo: res.custoTotal === custoOtimo,
      });
    }

    rodadas.push(linha);
  }

  return { rodadas, acumulado };
}

function imprimirRelatorio({ rodadas, acumulado }) {
  const sep = "=".repeat(80);
  const lin = "-".repeat(80);

  // ── Tabela por rodada ──────────────────────────────────────────────
  console.log("\n" + sep);
  console.log(" RESULTADOS POR RODADA");
  console.log(sep);
  console.log(
    " Rod | Ótimo || A*+Fort  nós | A*+Frac  nós | Gul+Fort  nós | Gul+Frac  nós"
  );
  console.log(lin);

  for (const r of rodadas) {
    const [a, b, c, d] = r.resultados;
    const fmt = (res) =>
      res.custo !== null
        ? `${String(res.custo).padStart(4)}${res.otimo ? "✓" : "✗"} ${String(res.nos).padStart(3)}`
        : `  -- ${String(res.nos).padStart(3)}`;

    console.log(
      ` ${String(r.rodada).padStart(3)} | ${String(r.custoOtimo ?? "--").padStart(5)} ` +
      `|| ${fmt(a)}    | ${fmt(b)}    | ${fmt(c)}     | ${fmt(d)}`
    );
  }

  // ── Tabela de médias ───────────────────────────────────────────────
  console.log("\n" + sep);
  console.log(` MÉDIAS SOBRE ${RODADAS} RODADAS`);
  console.log(sep);
  console.log(" Combinação          | Nós (méd) | Custo (méd) | Tempo méd (ms) | Ótimo %");
  console.log(lin);

  for (let i = 0; i < combinacoes.length; i++) {
    const ac = acumulado[i];
    const validas = RODADAS - ac.falhou;
    const medNos   = (ac.totalNos   / RODADAS).toFixed(1);
    const medCusto = validas > 0 ? (ac.totalCusto / validas).toFixed(1) : "--";
    const medTempo = (ac.totalTempo / RODADAS).toFixed(3);
    const pctOtimo = ((ac.achouOtimo / RODADAS) * 100).toFixed(0) + "%";

    console.log(
      ` ${combinacoes[i].nome.padEnd(20)}| ${String(medNos).padStart(9)} | ${String(medCusto).padStart(11)} | ${String(medTempo).padStart(14)} | ${pctOtimo}`
    );
  }

  console.log(sep);

  // ── Conclusão rápida ───────────────────────────────────────────────
  console.log("\n ANÁLISE:");
  console.log(
    "  • A* (ambas heurísticas) garante o caminho de custo mínimo."
  );
  console.log(
    "  • Guloso expande menos nós, mas pode não encontrar o caminho ótimo."
  );
  console.log(
    "  • Heurística Fraca faz o A* expandir mais nós (subestima demais o custo real)."
  );
  console.log(
    "  • Heurística Forte guia melhor a busca, reduzindo nós expandidos no A*.\n"
  );
}

module.exports = { rodarComparacao, imprimirRelatorio };
