// Estado global
let estado = { matriz: null, origem: null, destino: null, turno: 0 };
let ultimaSelecao = { algo: "ambos", h: "forte" };
let timeoutsAtivos = [];

// ── Inicialização ─────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  novoTabuleiro();
  document.getElementById("btn-novo").addEventListener("click", novoTabuleiro);
  document.getElementById("btn-executar").addEventListener("click", () => executar(false));
  document.getElementById("btn-avancar").addEventListener("click", avancarTurno);
});

// ── Tabuleiro ─────────────────────────────────────────────────────────────────

function novoTabuleiro() {
  cancelarAnimacao();
  estado = gerarTabuleiro();
  estado.bloqueado = false;
  renderizarBase(estado);
  atualizarInfo();
  limparMetricas();
  document.getElementById("btn-avancar").disabled = false;
}

function avancarTurno() {
  if (estado.bloqueado) return;
  cancelarAnimacao();

  const hasCaminho = evoluirTabuleiro(
    estado.matriz, estado.origem, estado.destino, estado.ultimoCaminho ?? []
  );
  estado.turno++;

  if (!hasCaminho) {
    estado.bloqueado = true;
    renderizarBase(estado);
    atualizarInfo();
    document.getElementById("btn-avancar").disabled = true;
    return;
  }

  atualizarInfo();
  executar(true);
}

// ── Executar ──────────────────────────────────────────────────────────────────

function executar(reexecutando = false) {
  cancelarAnimacao();

  if (!reexecutando) {
    ultimaSelecao.algo = document.getElementById("sel-algo").value;
    ultimaSelecao.h    = document.getElementById("sel-heuristica").value;
  }

  const { matriz, origem, destino } = estado;
  const h       = ultimaSelecao.h === "forte" ? heuristicaForte : heuristicaFraca;
  const hNome   = ultimaSelecao.h === "forte" ? "H. Forte (Manhattan)" : "H. Fraca (h=0)";
  const algoSel = ultimaSelecao.algo;
  const velocidade = Number(document.getElementById("sel-velocidade").value);

  const custoOtimo = calcularCustoOtimo(matriz, origem, destino);
  const resultados = [];

  if (algoSel === "astar" || algoSel === "ambos") {
    const t0  = performance.now();
    const res = aStar(matriz, origem, destino, h);
    resultados.push({ nome: `A* — ${hNome}`, ...res, tempo: performance.now() - t0, custoOtimo });
  }

  if (algoSel === "guloso" || algoSel === "ambos") {
    const t0  = performance.now();
    const res = guloso(matriz, origem, destino, h);
    resultados.push({ nome: `Guloso — ${hNome}`, ...res, tempo: performance.now() - t0, custoOtimo });
  }

  // Guarda o caminho do primeiro resultado (A* quando disponível) para o próximo turno
  const melhor = resultados.find(r => r.caminho) ?? null;
  estado.ultimoCaminho = melhor?.caminho ?? [];

  renderizarBase(estado);
  renderizarMetricas(resultados, custoOtimo);

  // Anima os resultados em sequência: primeiro A*, depois Guloso
  let delay = 0;
  for (const res of resultados) {
    const isOtimo = res.custoTotal !== null && res.custoTotal === custoOtimo;
    delay = agendarAnimacao(res.visitados, res.caminho, isOtimo, velocidade, delay);
    // Pausa entre algoritmos
    delay += velocidade > 0 ? 400 : 0;
  }
}

// ── Animação ──────────────────────────────────────────────────────────────────

function agendarAnimacao(visitados, caminho, isOtimo, velocidade, offsetInicial) {
  const classeCaminho = isOtimo ? "caminho-otimo" : "caminho-sub";
  const caminhoSet    = new Set((caminho ?? []).map(([l, c]) => `${l}-${c}`));

  // Células visitadas que NÃO estão no caminho final = erros (becos sem saída)
  const erros = visitados.filter(k => !caminhoSet.has(k));

  if (velocidade === 0) {
    erros.forEach(key        => marcarCelula(key, "erro",         true));
    (caminho ?? []).forEach(([l, c]) => marcarCelula(`${l}-${c}`, classeCaminho, true));
    return offsetInicial;
  }

  // Fase 1 — cinza: mostra cada célula explorada uma a uma
  visitados.forEach((key, i) => {
    const id = setTimeout(() => marcarCelula(key, "visitado"), offsetInicial + i * velocidade);
    timeoutsAtivos.push(id);
  });

  const fimFase1 = offsetInicial + visitados.length * velocidade + 120;

  // Fase 2 — preto: células que foram erro ficam escuras (todas de uma vez)
  const idErro = setTimeout(() => {
    erros.forEach(key => marcarCelula(key, "erro", true));
  }, fimFase1);
  timeoutsAtivos.push(idErro);

  const fimFase2 = fimFase1 + 200;

  // Fase 3 — caminho: revela o caminho correto célula a célula
  (caminho ?? []).forEach(([l, c], i) => {
    const id = setTimeout(
      () => marcarCelula(`${l}-${c}`, classeCaminho, true),
      fimFase2 + i * (velocidade * 1.5)
    );
    timeoutsAtivos.push(id);
  });

  return fimFase2 + (caminho?.length ?? 0) * (velocidade * 1.5);
}

function marcarCelula(key, classe, sobrescrever = false) {
  const cell = document.getElementById(`cell-${key}`);
  if (!cell || cell.classList.contains("origem") || cell.classList.contains("destino")) return;
  if (sobrescrever) {
    cell.classList.remove("visitado", "caminho-otimo", "caminho-sub");
  }
  cell.classList.add(classe);
}

function cancelarAnimacao() {
  timeoutsAtivos.forEach(id => clearTimeout(id));
  timeoutsAtivos = [];
}

// ── Renderizar base (terreno apenas) ─────────────────────────────────────────

function renderizarBase(est) {
  const { matriz, origem, destino } = est;
  const board = document.getElementById("board");
  board.innerHTML = "";

  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      const casa = matriz[i][j];
      const key  = `${i}-${j}`;
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.id = `cell-${key}`;

      const isOrigem  = i === origem[0] && j === origem[1];
      const isDestino = i === destino[0] && j === destino[1];

      if (isOrigem) {
        cell.classList.add("origem");
        cell.textContent = "♜";
      } else if (isDestino) {
        cell.classList.add("destino");
        cell.textContent = "🎯";
      } else {
        cell.classList.add(casa.tipo);
      }

      if (casa.custo !== Infinity) cell.dataset.custo = casa.custo;
      cell.title = `(${i}, ${j}) — ${casa.tipo}${casa.custo !== Infinity ? ` | custo ${casa.custo}` : " | bloqueado"}`;
      board.appendChild(cell);
    }
  }
}

// ── Métricas ──────────────────────────────────────────────────────────────────

function renderizarMetricas(resultados, custoOtimo) {
  const container = document.getElementById("metricas");
  container.innerHTML = "";

  if (custoOtimo === null) {
    container.innerHTML = `<p class="placeholder" style="color:#f87171">Destino inalcançável neste turno.</p>`;
    return;
  }

  for (const r of resultados) {
    const isOtimo = r.custoTotal !== null && r.custoTotal === custoOtimo;
    const badge = r.custoTotal !== null
      ? (isOtimo
          ? `<span class="badge-otimo">ótimo</span>`
          : `<span class="badge-sub">+${r.custoTotal - custoOtimo}</span>`)
      : `<span class="badge-sub">sem caminho</span>`;

    const row = document.createElement("div");
    row.className = "metric-row active";
    row.innerHTML = `
      <span class="metric-label">${r.nome}</span>
      <div class="metric-values">
        <div class="metric-val">${r.custoTotal ?? "—"}${badge}<small>custo</small></div>
        <div class="metric-val">${r.nosExpandidos}<small>nós</small></div>
        <div class="metric-val">${r.tempo.toFixed(2)}ms<small>tempo</small></div>
      </div>`;
    container.appendChild(row);
  }
}

function limparMetricas() {
  document.getElementById("metricas").innerHTML =
    `<p class="placeholder">Execute um algoritmo para ver os resultados.</p>`;
}

// ── Info ──────────────────────────────────────────────────────────────────────

function atualizarInfo() {
  const { origem, destino, turno } = estado;
  document.getElementById("info-origem").textContent  = `(${origem[0]}, ${origem[1]})`;
  document.getElementById("info-destino").textContent = `(${destino[0]}, ${destino[1]})`;
  document.getElementById("info-turno").innerHTML = `Turno <strong>${turno}</strong>`;
}
