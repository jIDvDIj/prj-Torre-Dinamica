# Documentação — Torre Dinâmica

## Objetivo do Sistema

O sistema simula uma **torre de xadrez** que precisa se deslocar de um ponto de origem até um destino em um tabuleiro 8×8. O tabuleiro é **dinâmico**: blocos de gelo surgem a cada turno e bloqueiam rotas, forçando o algoritmo a recalcular o caminho.

O objetivo é comparar o desempenho de dois algoritmos de busca — **A\*** e **Busca Gulosa** — sob diferentes heurísticas, medindo qualidade do caminho encontrado, número de nós explorados e tempo de processamento.

---

## O Tabuleiro

O tabuleiro é uma grade 8×8. A torre se move apenas nas quatro direções cardeais (cima, baixo, esquerda, direita), sem diagonais.

| Terreno | Custo | Descrição |
|---|---|---|
| Comum | 1 | Livre, sem penalidade |
| Gelo | Bloqueado | Rota fechada temporariamente; derrete após alguns turnos |

### Dinamismo

- O tabuleiro começa com **5 blocos de gelo** em posições aleatórias
- A cada turno avançado, surgem **2 novos blocos** em posições livres aleatórias
- Cada bloco de gelo tem um contador de turnos até derreter e voltar a ser comum
- Origem e destino nunca são bloqueados

---

## Algoritmos de Busca

### A* (A-estrela)

Avalia cada célula pelo custo total estimado:

```
f(n) = g(n) + h(n)
```

- **g(n)** — custo acumulado real desde a origem até a célula atual
- **h(n)** — estimativa do custo restante até o destino (heurística)

Por considerar o custo real acumulado, o A\* **sempre encontra o caminho de menor custo**, mas pode expandir mais nós dependendo da qualidade da heurística.

### Busca Gulosa (Greedy Best-First)

Avalia cada célula somente pela estimativa até o destino:

```
f(n) = h(n)
```

Por ignorar o custo acumulado **g(n)**, a busca gulosa tende a explorar menos nós e ser mais rápida, mas **não garante o caminho ótimo**. Pode escolher rotas que parecem promissoras localmente, mas que resultam em custo total maior.

---

## Heurísticas

| Heurística | Fórmula | Comportamento |
|---|---|---|
| **Forte — Manhattan** | `\|Δlinha\| + \|Δcoluna\|` | Ideal para a torre. Guia bem a busca, reduz nós expandidos. |
| **Fraca — h(n) = 0** | `0` | Sem estimativa. O A\* degenera em Dijkstra e expande muito mais nós. |

---

## Lendo a Animação

A busca é exibida em três fases:

1. **Cinza (exploração)** — cada célula analisada aparece em cinza, na ordem exata em que foi visitada. Mostra o "raciocínio" do algoritmo passo a passo.

2. **Preto (erros)** — ao fim da busca, todas as células visitadas que **não fazem parte do caminho final** ficam pretas. São os becos sem saída — o algoritmo foi até lá e voltou.

3. **Caminho final** — o trajeto se revela célula a célula:
   - 🟢 **Verde** — caminho ótimo (menor custo possível)
   - 🔴 **Vermelho** — caminho sub-ótimo (a busca gulosa pode chegar aqui)

Quando o modo **"A\* e Guloso"** está selecionado, as duas animações ocorrem em sequência, permitindo comparar visualmente quantos nós cada algoritmo expandiu.

---

## Métricas Exibidas

| Métrica | O que representa |
|---|---|
| **Custo** | Soma dos custos das células no caminho encontrado. Menor é melhor. |
| **Nós expandidos** | Quantas células o algoritmo analisou. Indica o esforço computacional. |
| **Tempo (ms)** | Tempo de execução real do algoritmo. |
| **ótimo / +N** | Se o caminho é o de menor custo possível, ou quanto de custo extra foi adicionado. |
