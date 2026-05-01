1. Objetivo
O aluno (ou dupla) deverá escolher um problema dentro de um contexto de jogo e
resolvê-lo seguindo uma das duas trilhas abaixo, focando na análise comparativa de
desempenho.
2. Escolha de Trilha e Algoritmos
Trilha A: Navegação e Caminho Mínimo
Focada em agentes que precisam se deslocar de um ponto A para um ponto B.
* Algoritmos: Implementar obrigatoriamente Busca A* e Gulosa.
* O que comparar: O impacto de uma Heurística Forte (ex: Distância Euclidiana em
linha reta) versus uma Heurística Fraca (ex: uma função que subestima drasticamente
o custo ou ignora obstáculos).
* Análise exigida: Comparar o caminho encontrado (o A* achou o melhor? A Gulosa foi
mais rápida, mas errou o caminho?) e o número de nós expandidos (qual heurística
precisou expandir menos nós? A diferença de nós expandidos foi significativa?).

Trilha B: Otimização de Estados
Focada em problemas onde não importa o "caminho", mas sim encontrar a
configuração perfeita (ex: posicionar peças em um tabuleiro).
* Algoritmos: Implementar obrigatoriamente Hill Climbing e Simulated Annealing.
* O que comparar: O desempenho de ambos os algoritmos para o mesmo problema.
Avaliar diferentes formas de escalonamento da temperatura para o Simulated
Annealing.
* Análise exigida: Quantas vezes o Hill Climbing ficou preso em um "máximo/mínimo
local" comparado ao sucesso do Simulated Annealing? Como a "temperatura" afetou a
descoberta da solução global?

---

3. Requisitos de Originalidade
Para garantir a autoria e criatividade, o jogo/simulação deve possuir uma variável
própria. Exemplos:
* Labirinto Dinâmico: As paredes mudam ou têm custos diferentes (lama, asfalto).
* Alocação de Defesa: Onde colocar 10 arqueiros em um castelo para cobrir a maior
área de invasão.
* Puzzle Customizado: Uma variante do "Puzzle de 8 peças" ou problemas de logística
de carga.
4. Relatório Técnico (Estrutura Obrigatória)
1. Descrição do Problema: Qual o cenário do jogo e o que a IA deve resolver.
2. Modelagem do Espaço: Definição de Estados, Funções de Transição e Objetivo.
3. Desenvolvimento Técnico:
* Para Trilha A: Definição formal das funções heurísticas h(n) (Forte e Fraca).
* Para Trilha B: Definição da função de Fitness (qualidade do estado) e parâmetros do
Simulated Annealing (temperatura).
4. Resultados Comparativos: Tabelas ou gráficos comparando tempo de processamento,
número de iterações e eficácia do resultado final.
5. Conclusão: Qual abordagem se mostrou mais adequada para o seu jogo e por quê.