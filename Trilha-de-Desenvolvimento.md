# Trilha de Desenvolvimento — Torre Dinâmica

## Fase 1 — Base (já concluída)
- [x] Criar tabuleiro 8×8 com terrenos e custos (`js/tabuleiro.js`)
- [x] Implementar classe `Casa` com linha, coluna, tipo e custo
- [x] Gerar caminho garantido de `estrada` entre origem e destino
- [x] Imprimir tabuleiro no terminal com legenda
- [x] Implementar movimentos adjacentes da torre (`js/movimento.js`)
- [x] Criar classe `Torre` (`peca/torre.js`)

---

## Fase 2 — Algoritmos de Busca

### 2.1 — Heurísticas
- [ ] Implementar **Heurística Forte**: Distância Euclidiana entre casa atual e destino
- [ ] Implementar **Heurística Fraca**: função que ignora obstáculos ou subestima drasticamente o custo

### 2.2 — Algoritmo Guloso (Greedy Best-First Search)
- [ ] Criar `js/guloso.js`
- [ ] Implementar fila de prioridade ordenada apenas por `h(n)`
- [ ] Retornar o caminho encontrado e a lista de nós expandidos

### 2.3 — Algoritmo A*
- [ ] Criar `js/aStar.js`
- [ ] Implementar fila de prioridade ordenada por `f(n) = g(n) + h(n)`
- [ ] Rastrear custo acumulado `g(n)` para cada nó visitado
- [ ] Retornar o caminho ótimo encontrado e a lista de nós expandidos

---

## Fase 3 — Comparação e Análise

- [ ] Executar os dois algoritmos no mesmo tabuleiro (mesma semente)
- [ ] Coletar métricas para cada execução:
  - Custo total do caminho encontrado
  - Número de nós expandidos
  - Tempo de processamento
- [ ] Repetir para **Heurística Forte** e **Heurística Fraca** (4 combinações no total)
- [ ] Exibir tabela comparativa no terminal com os resultados

---

## Fase 4 — Relatório Técnico

- [ ] **Seção 1 — Descrição do Problema**: descrever o cenário da torre no tabuleiro dinâmico
- [ ] **Seção 2 — Modelagem do Espaço**: definir estados, função de transição e condição de objetivo
- [ ] **Seção 3 — Desenvolvimento Técnico**: definição formal de `h(n)` forte e `h(n)` fraca
- [ ] **Seção 4 — Resultados Comparativos**: tabelas e/ou gráficos das 4 combinações testadas
- [ ] **Seção 5 — Conclusão**: qual abordagem foi mais adequada e por quê

---

## Fase 5 — Finalização

- [ ] Revisar e limpar o código (remover logs de debug, padronizar nomes)
- [ ] Garantir que `node main.js` executa todo o fluxo de ponta a ponta
- [ ] Entregar relatório técnico em formato PDF
