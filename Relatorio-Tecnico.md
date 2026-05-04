# Relatório Técnico — Torre Dinâmica

**Disciplina:** Inteligência Artificial  
**Trilha:** A — Navegação e Caminho Mínimo  
**Algoritmos:** A\* e Busca Gulosa (Greedy Best-First Search)  

---

## 1. Descrição do Problema

O projeto simula uma **torre de xadrez** que deve encontrar o caminho de menor custo entre dois pontos em um tabuleiro 8×8. O tabuleiro é **dinâmico**: os terrenos possuem custos diferentes, e a distribuição de obstáculos é gerada aleatoriamente a cada execução.

A torre movimenta-se exclusivamente nas quatro direções cardeais (cima, baixo, esquerda, direita), sem diagonais. Origem e destino são sempre separados por no mínimo 4 casas (distância Manhattan), garantindo percursos não triviais. O desafio está em encontrar o caminho que minimize o custo total de travessia, respeitando os bloqueios impostos pelas barreiras.

O sistema compara o desempenho de dois algoritmos de busca — **A\*** e **Guloso** — sob duas heurísticas distintas (**forte** e **fraca**), avaliando qualidade do caminho encontrado, número de nós expandidos e tempo de processamento.

---

## 2. Modelagem do Espaço

### 2.1 Estados

Cada **estado** é uma posição `(linha, coluna)` no tabuleiro, representada pela classe `Casa`:

```
Estado = (linha ∈ {0..7}, coluna ∈ {0..7}, tipo, custo)
```

| Terreno  | Símbolo | Custo       | Frequência |
|----------|:-------:|:-----------:|:----------:|
| Estrada  | `.`     | 1           | 12%        |
| Neve     | `n`     | 2           | 13%        |
| Terra    | `t`     | 3           | 15%        |
| Areia    | `a`     | 4           | 15%        |
| Lama     | `m`     | 5           | 15%        |
| Floresta | `f`     | 7           | 15%        |
| Barreira | `X`     | ∞ (bloqueio)| 15%        |

O estado inicial (origem) e o estado objetivo (destino) são sorteados aleatoriamente com distância Manhattan mínima de 4, e nunca recebem tipo barreira. O tabuleiro garante ao menos um caminho de `estrada` entre os dois pontos.

### 2.2 Função de Transição

A partir de um estado `(i, j)`, a função de transição gera os sucessores válidos:

```
Sucessores(i, j) = { (i±1, j), (i, j±1) } tal que:
  - a célula esteja dentro dos limites do tabuleiro (0 ≤ linha, coluna ≤ 7)
  - custo da célula ≠ ∞
```

O custo de transição entre dois estados é o **custo do terreno da célula de destino**.

### 2.3 Condição de Objetivo

```
Objetivo(estado) = (estado.linha == destino[0]) ∧ (estado.coluna == destino[1])
```

O algoritmo termina quando o estado objetivo é removido da fila de prioridade como o nó de menor custo.

---

## 3. Desenvolvimento Técnico

### 3.1 Algoritmo A\*

O A\* ordena a fila de prioridade pela função de avaliação:

```
f(n) = g(n) + h(n)
```

- **g(n):** custo acumulado real desde a origem até o nó `n`
- **h(n):** estimativa heurística do custo de `n` até o destino

Por considerar o custo real acumulado `g(n)`, o A\* **garante o caminho de custo mínimo** desde que `h(n)` seja admissível, ou seja, nunca superestime o custo real.

### 3.2 Algoritmo Guloso (Greedy Best-First Search)

O Guloso ordena a fila apenas pela heurística:

```
f(n) = h(n)
```

Por ignorar `g(n)`, o Guloso tende a expandir menos nós e ser mais veloz, mas **não garante o caminho ótimo**: prioriza o que parece promissor localmente, podendo acumular custo maior ao longo da rota.

### 3.3 Heurísticas

#### H.Forte — Distância Euclidiana

```
h_forte(n, destino) = √( (destino.linha − n.linha)² + (destino.coluna − n.coluna)² )
```

A distância Euclidiana estima diretamente a distância geométrica em linha reta entre o nó atual e o destino. Por nunca superestimar o custo real de deslocamento (custo mínimo por passo = 1), é **admissível**. Ela fornece uma estimativa próxima da realidade, guiando a busca com mais precisão e reduzindo o número de nós expandidos.

#### H.Fraca — Manhattan Atenuada

```
h_fraca(n, destino) = ( |destino.linha − n.linha| + |destino.coluna − n.coluna| ) / 10
```

A divisão por 10 faz a heurística **subestimar drasticamente** o custo real. Com valores próximos de zero, a função praticamente não discrimina os nós, tornando a busca quase cega: o A\* degenera a um comportamento semelhante ao Dijkstra, expandindo muitos nós desnecessários. O Guloso, com essa heurística, também perde a capacidade de direcionamento e explora a grade de forma mais uniforme.

---

## 4. Resultados Comparativos

Os testes foram executados em **20 rodadas** com tabuleiros gerados aleatoriamente (distância mínima de 4 entre origem e destino). O custo de referência em cada rodada foi definido como o resultado do A\* com H.Forte.

### 4.1 Médias sobre 20 rodadas

| Combinação          | Nós expandidos (méd) | Custo (méd) | Tempo (ms, méd) | Caminho ótimo |
|---------------------|---------------------:|------------:|----------------:|:-------------:|
| A\* + H.Forte       |                  8,1 |         6,5 |           0,060 | **100%**      |
| A\* + H.Fraca       |                 13,6 |         6,5 |           0,085 | **100%**      |
| Guloso + H.Forte    |                  7,5 |        13,6 |           0,072 | 40%           |
| Guloso + H.Fraca    |                  7,5 |         6,5 |           0,043 | **100%**      |

### 4.2 Resultados por rodada

| Rod | Custo ótimo | A\*+Forte | nós | A\*+Fraca | nós | Gul+Forte | nós | Gul+Fraca | nós |
|-----|:-----------:|:---------:|:---:|:---------:|:---:|:---------:|:---:|:---------:|:---:|
|  1  |      6      |    6 ✓    |  7  |    6 ✓    |  9  |    6 ✓    |  7  |    6 ✓    |  7  |
|  2  |      5      |    5 ✓    |  7  |    5 ✓    |  9  |   12 ✗    |  6  |    5 ✓    |  6  |
|  3  |     10      |   10 ✓    | 13  |   10 ✓    | 25  |   27 ✗    | 11  |   10 ✓    | 11  |
|  4  |      6      |    6 ✓    |  7  |    6 ✓    | 11  |   14 ✗    |  7  |    6 ✓    |  7  |
|  5  |      6      |    6 ✓    |  7  |    6 ✓    | 12  |    6 ✓    |  7  |    6 ✓    |  7  |
|  6  |      5      |    5 ✓    |  8  |    5 ✓    | 15  |    5 ✓    |  6  |    5 ✓    |  6  |
|  7  |      7      |    7 ✓    |  8  |    7 ✓    | 13  |   18 ✗    |  8  |    7 ✓    |  8  |
|  8  |      5      |    5 ✓    |  6  |    5 ✓    |  8  |   13 ✗    |  6  |    5 ✓    |  6  |
|  9  |      5      |    5 ✓    |  6  |    5 ✓    | 10  |    5 ✓    |  6  |    5 ✓    |  6  |
| 10  |      4      |    4 ✓    |  5  |    4 ✓    |  6  |    4 ✓    |  5  |    4 ✓    |  5  |
| 11  |      6      |    6 ✓    |  8  |    6 ✓    | 17  |   18 ✗    |  7  |    6 ✓    |  7  |
| 12  |      9      |    9 ✓    | 12  |    9 ✓    | 21  |   24 ✗    | 10  |    9 ✓    | 10  |
| 13  |      5      |    5 ✓    |  6  |    5 ✓    | 10  |    5 ✓    |  6  |    5 ✓    |  6  |
| 14  |      5      |    5 ✓    |  6  |    5 ✓    |  8  |    9 ✗    |  6  |    5 ✓    |  6  |
| 15  |      5      |    5 ✓    |  7  |    5 ✓    | 11  |    5 ✓    |  6  |    5 ✓    |  6  |
| 16  |      9      |    9 ✓    | 10  |    9 ✓    | 22  |   20 ✗    | 10  |    9 ✓    | 10  |
| 17  |      9      |    9 ✓    | 12  |    9 ✓    | 20  |   21 ✗    | 10  |    9 ✓    | 10  |
| 18  |      4      |    4 ✓    |  5  |    4 ✓    |  7  |    4 ✓    |  5  |    4 ✓    |  5  |
| 19  |      8      |    8 ✓    |  9  |    8 ✓    | 13  |   27 ✗    |  9  |    8 ✓    |  9  |
| 20  |     10      |   10 ✓    | 12  |   10 ✓    | 24  |   29 ✗    | 11  |   10 ✓    | 11  |

*(✓ = caminho ótimo encontrado, ✗ = custo superior ao ótimo)*

### 4.3 Análise dos resultados

**Impacto da heurística no A\*:**  
O A\* com H.Forte expandiu em média **8,1 nós** contra **13,6 nós** do A\* com H.Fraca — uma redução de **40%**. Ambas encontraram o caminho ótimo em 100% das rodadas. A maior variedade de custos de terreno (1 a 7) amplificou essa diferença em relação a tabuleiros mais simples: a H.Forte direciona melhor a busca justamente porque os custos mais altos tornam os atalhos geométricos mais valiosos de identificar cedo.

**Impacto da heurística no Guloso:**  
O Guloso com H.Forte acertou o caminho ótimo em apenas **40% das rodadas**, com custo médio de 13,6 — **109% acima do ótimo**. Esse é o pior resultado observado: a presença de floresta (custo 7) e areia (custo 4) cria armadilhas onde o Guloso avança na direção correta geometricamente, mas acumula custo alto por ignorar `g(n)`. O Guloso com H.Fraca acertou **100% das rodadas**, pelo mesmo motivo dos experimentos anteriores: a estimativa quase-zero força exploração mais completa.

**Impacto da distância mínima:**  
Com a restrição de distância mínima de 4, os caminhos ficaram mais longos e os terrenos intermediários passaram a ter maior influência no custo total. Isso torna os erros do Guloso+H.Forte mais expressivos (custo médio dobrou em relação à versão anterior) e amplia o benefício da H.Forte no A\*.

**Eficiência computacional:**  
Todos os tempos ficaram abaixo de 0,09 ms. Para um tabuleiro 8×8, as diferenças de tempo não são significativas; o indicador relevante de eficiência é o número de nós expandidos.

---

## 5. Conclusão

Para o cenário da Torre Dinâmica com seis tipos de terreno e distância mínima garantida, o **A\* com Heurística Forte (Euclidiana)** consolidou-se como a abordagem mais adequada: garante o caminho de menor custo em **100% dos casos** com o menor número de nós expandidos entre as variantes do A\*.

A introdução de terrenos com custos variados (neve=2, terra=3, areia=4, lama=5, floresta=7) evidenciou ainda mais as limitações do Guloso: com mais tipos de terreno, a probabilidade de o caminho geometricamente mais curto ser também o mais barato diminui, fazendo o Guloso+H.Forte errar em 60% das rodadas.

A H.Forte reduziu **40% dos nós expandidos** no A\* em relação à H.Fraca. Em tabuleiros maiores, essa diferença seria ainda mais expressiva.

Em síntese:

| Critério                  | Melhor abordagem         |
|---------------------------|--------------------------|
| Garantia de otimalidade   | A\* (qualquer h)         |
| Menor esforço de busca    | Guloso + H.Forte         |
| Melhor equilíbrio geral   | **A\* + H.Forte**        |
| Pior caso observado       | Guloso + H.Forte (40%)   |
