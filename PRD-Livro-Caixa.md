# PRD — Livro-Caixa Pessoal para Venda de Marmitas

## 1. Visão geral

### Produto

Aplicação web de uso pessoal para registrar e acompanhar as movimentações financeiras de um negócio próprio de venda de marmitas. O produto substitui anotações dispersas e planilhas pouco práticas por um livro-caixa simples de atualizar durante a rotina de produção, entrega e vendas.

### Problema

Uma operação de marmitas movimenta dinheiro em diversos momentos: recebimentos de pedidos, compra de ingredientes, embalagens, combustível, taxas de aplicativos e despesas ocasionais. Sem um registro único e padronizado, torna-se difícil saber o saldo real, quais custos mais impactam o negócio e se a operação está lucrativa.

### Solução

Disponibilizar uma interface rápida para registrar entradas e saídas, classificá-las por categoria e consultar o resultado financeiro por dia, mês e período selecionado.

## 2. Objetivo

### Objetivo principal

Dar ao proprietário uma visão confiável e atualizada do caixa do negócio, permitindo registrar cada movimentação financeira e identificar rapidamente o saldo e o resultado do período.

### Objetivos secundários

- Reduzir o tempo necessário para registrar uma venda ou despesa.
- Organizar movimentações por categorias relevantes para uma operação de marmitas.
- Permitir conferência diária do caixa e análise mensal da rentabilidade.
- Ajudar a identificar despesas recorrentes e principais fontes de receita.
- Manter um histórico consultável de lançamentos financeiros.

### Indicadores de sucesso

- O usuário consegue registrar uma movimentação em menos de um minuto.
- O saldo exibido reflete corretamente os lançamentos cadastrados no período.
- O usuário consegue localizar, filtrar e revisar uma movimentação anterior.
- O usuário consegue distinguir receitas, despesas e resultado líquido sem fazer cálculos manuais.

## 3. Público e contexto de uso

### Usuário primário

O próprio dono do negócio de marmitas, responsável por vendas, compras, produção e controle financeiro.

### Contexto

O uso acontece principalmente em celular, entre pedidos, compras e entregas, e também em desktop para conferências mais detalhadas. O produto deve usar moeda brasileira (R$) e linguagem simples, sem exigir conhecimento contábil.

## 4. Escopo

### Dentro do escopo — primeira versão

- Dashboard com saldo atual, total de entradas, total de saídas e resultado do período.
- Cadastro de vendas com entrada e saída obrigatórias no mesmo registro.
- Campos de venda: descrição, valor de entrada, valor de saída, quantidade de marmitas, data, meio de pagamento e observação opcional.
- Cálculo automático do resultado de cada venda como entrada menos saída.
- Categorias iniciais adequadas ao negócio de marmitas:
  - Receitas: venda de marmitas, encomendas, bebidas, sobremesas, outros recebimentos.
  - Despesas: ingredientes, embalagens, gás, combustível/entrega, taxas de aplicativos, aluguel, água/luz, marketing, manutenção e outros gastos.
- Listagem cronológica de lançamentos.
- Filtros por período, tipo, categoria e meio de pagamento.
- Edição e exclusão de lançamentos.
- Resumo financeiro por categoria e por período.
- Exportação dos lançamentos filtrados em CSV para backup diário.
- Persistência local dos dados no navegador para que os lançamentos continuem disponíveis no mesmo dispositivo.
- Interface responsiva com prioridade para mobile.

### Fora do escopo — primeira versão

- Emissão de nota fiscal.
- Integração bancária, PIX, aplicativos de entrega ou maquininhas.
- Geração de obrigações fiscais, contábeis ou declaração de impostos.
- Gestão de estoque, ficha técnica, cardápio, pedidos ou clientes.
- Múltiplos usuários, permissões e controle de acesso.
- Sincronização entre dispositivos, backup em nuvem ou login.
- Conciliação bancária automática.

### Decisões em aberto

- Se haverá login, armazenamento em nuvem e acesso em vários dispositivos em uma versão futura.
- Se o sistema deverá exportar relatórios em PDF ou planilha.
- Se o negócio utilizará centros de custo, múltiplas contas ou mais de um caixa.

## 5. Diretrizes do design system

### Tipografia

- Família tipográfica principal: **Inter**.
- A interface deve priorizar legibilidade em telas pequenas, com hierarquia clara entre títulos, resumos financeiros, rótulos e dados de lançamento.
- Valores financeiros devem usar algarismos tabulares quando disponíveis para facilitar a leitura e comparação de colunas.

### Paleta de cores

| Token | Cor | Uso principal |
|---|---|---|
| `peach-200` | `#FFBE91` | Destaques quentes, ações secundárias e elementos de apoio. |
| `sand-100` | `#FFDDB0` | Superfícies de apoio, fundos suaves e estados informativos. |
| `cream-50` | `#FFFCE1` | Fundo base claro da aplicação. |
| `sky-100` | `#CFEBFF` | Filtros, áreas de análise, informações neutras e contraste frio. |

### Princípios visuais

- A interface deve parecer acolhedora e organizada, sem sacrificar a leitura rápida dos números.
- A cor não deve ser a única forma de diferenciar entrada, saída, alerta ou estado de erro; textos e ícones também devem comunicar o significado.
- Os contrastes de texto e controles devem atender aos requisitos de acessibilidade, mesmo quando a paleta base for clara.
- A aplicação deve manter consistência de espaçamento, bordas, estados de foco e componentes entre desktop e mobile.

## 6. Requisitos funcionais

### RF01 — Visualizar resumo financeiro

O sistema deve mostrar, para o período selecionado:

- Saldo do período.
- Total de entradas.
- Total de saídas.
- Resultado líquido, calculado como entradas menos saídas.

### RF02 — Registrar movimentação

O sistema deve permitir cadastrar uma venda somente após o preenchimento manual dos valores de entrada e saída. O resultado deve ser calculado automaticamente como entrada menos saída. O campo de meio de pagamento deve permitir, no mínimo, dinheiro, PIX, cartão e transferência/outros.

### RF03 — Gerenciar categorias

O sistema deve oferecer as categorias iniciais definidas neste documento e permitir selecionar uma categoria compatível com o tipo do lançamento.

### RF04 — Consultar lançamentos

O sistema deve exibir os lançamentos em ordem de data, mostrando tipo, descrição, categoria, meio de pagamento, data e valor.

### RF05 — Filtrar informações

O usuário deve conseguir limitar a visualização por intervalo de datas, tipo de movimentação, categoria e meio de pagamento.

### RF06 — Editar e excluir lançamentos

O usuário deve conseguir corrigir ou remover um lançamento. A exclusão deve exigir confirmação para evitar perda acidental de dados.

### RF07 — Analisar despesas e receitas

O sistema deve apresentar um resumo por categoria que permita identificar onde houve maior receita e maior despesa no período.

### RF08 — Persistir os dados localmente

Os dados cadastrados devem continuar disponíveis ao fechar e reabrir o navegador no mesmo dispositivo, enquanto os dados locais do navegador não forem apagados.

### RF09 — Exportar histórico em CSV

O usuário deve conseguir exportar os lançamentos do dia ou período selecionado em CSV, com data, tipo, descrição, quantidade, entrada, saída, resultado, pagamento e observação.

## 7. Histórias de usuários

### HU01 — Registrar uma venda

Como dono do negócio, quero informar a entrada e a saída de cada venda para que o sistema calcule automaticamente o resultado e mantenha o caixa atualizado.

### HU02 — Registrar uma despesa

Como dono do negócio, quero registrar gastos como ingredientes e embalagens para saber quanto custa operar.

### HU03 — Conferir o caixa diário

Como dono do negócio, quero ver o saldo, entradas e saídas do dia para conferir se o dinheiro recebido e gasto está correto.

### HU04 — Analisar um mês

Como dono do negócio, quero consultar o resumo mensal para entender se o negócio teve lucro ou prejuízo.

### HU05 — Identificar os maiores custos

Como dono do negócio, quero ver as despesas agrupadas por categoria para identificar os custos que mais pesam no negócio.

### HU06 — Corrigir um erro de lançamento

Como dono do negócio, quero editar um lançamento registrado incorretamente para manter os relatórios confiáveis.

### HU07 — Remover lançamento indevido

Como dono do negócio, quero excluir um lançamento duplicado ou incorreto com confirmação para não alterar o caixa por engano.

### HU08 — Encontrar um lançamento antigo

Como dono do negócio, quero filtrar lançamentos por data, tipo ou categoria para localizar uma movimentação específica.

### HU09 — Usar pelo celular

Como dono do negócio, quero registrar uma movimentação pelo celular para não depender de estar no computador.

## 8. Critérios de aceitação

### CA01 — Cadastro válido de lançamento

- Dado que o usuário preenche descrição, entrada positiva, saída positiva e data válida, quando confirmar o formulário, então a venda deve ser salva e exibida na lista.
- O botão de salvar deve permanecer desabilitado até que entrada e saída tenham valores positivos.
- O resultado da venda deve ser atualizado automaticamente durante o preenchimento, usando entrada menos saída.
- O valor deve ser armazenado e exibido em reais, com duas casas decimais.
- Ao salvar uma entrada, o total de entradas e o saldo devem ser atualizados.
- Ao salvar uma saída, o total de saídas e o saldo devem ser atualizados.

### CA02 — Validação do formulário

- O sistema não deve salvar a venda se descrição, entrada, saída ou data não forem preenchidas.
- O sistema não deve aceitar entrada ou saída igual a zero ou negativa.
- O sistema deve informar de forma clara qual campo precisa ser corrigido.

### CA03 — Cálculo do resumo

- Para o período selecionado, entradas devem ser a soma dos lançamentos de entrada.
- Para o período selecionado, saídas devem ser a soma dos lançamentos de saída.
- O resultado líquido deve ser calculado como entradas menos saídas.
- Alterar ou excluir um lançamento deve atualizar os totais imediatamente.

### CA04 — Listagem e filtros

- A lista deve mostrar somente os lançamentos que atendem a todos os filtros selecionados.
- Sem filtros, a lista deve exibir os lançamentos do período padrão definido pela interface.
- Quando não houver lançamentos para os filtros aplicados, o sistema deve apresentar um estado vazio explicando que não há movimentações no período.

### CA05 — Edição

- Ao editar um lançamento, o formulário deve carregar os dados já cadastrados.
- Ao confirmar a edição, a lista e os resumos devem refletir os novos dados.
- A edição não deve criar um lançamento duplicado.

### CA06 — Exclusão

- Ao solicitar a exclusão, o sistema deve pedir confirmação antes de remover o lançamento.
- Se o usuário cancelar, nenhum dado deve ser alterado.
- Se confirmar, o lançamento deve desaparecer da lista e os totais devem ser recalculados.

### CA07 — Persistência local

- Após cadastrar um lançamento e recarregar a página, ele deve permanecer disponível no mesmo navegador.
- Se não houver dados salvos, o sistema deve iniciar em estado vazio, sem apresentar dados fictícios como registros reais.

### CA08 — Responsividade e acessibilidade básica

- As ações principais devem estar disponíveis em telas pequenas, sem rolagem horizontal.
- Campos e botões devem poder ser usados por toque.
- Formulários devem ter rótulos visíveis e mensagens de validação associadas aos respectivos campos.
- A navegação por teclado deve permitir alcançar e acionar controles essenciais.

### CA09 — Exportação CSV

- O botão de exportação deve ficar desabilitado quando não houver lançamentos no filtro atual.
- O arquivo deve conter somente os lançamentos visíveis no dia ou período filtrado.
- O nome do arquivo deve indicar a data ou o intervalo exportado.
- Valores monetários devem ser separados em entrada, saída e resultado.
- O arquivo deve usar codificação UTF-8 e formato compatível com Excel em português.

## 9. Edge cases

| Situação | Comportamento esperado |
|---|---|
| Valor informado com vírgula, por exemplo `25,50` | Interpretar como R$ 25,50 ou orientar o usuário sobre o formato aceito antes de salvar. |
| Valor com símbolo monetário ou separadores, por exemplo `R$ 1.250,00` | Normalizar o valor corretamente antes do salvamento. |
| Lançamento no futuro | Permitir somente se o usuário estiver planejando uma movimentação; na primeira versão, alertar e exigir confirmação antes de salvar. |
| Data inválida ou inexistente | Bloquear o salvamento e solicitar uma data válida. |
| Categoria incompatível com o tipo | Não permitir uma despesa em categoria de receita, nem o inverso. |
| Dois lançamentos aparentemente idênticos | Permitir o cadastro, pois podem ser operações legítimas, mas alertar sobre possível duplicidade quando data, valor, tipo e descrição coincidirem. |
| Exclusão acidental | Exigir confirmação explícita antes de apagar o lançamento. |
| Nenhum lançamento no período filtrado | Mostrar estado vazio sem zerar ou apagar os dados salvos. |
| Saldo negativo | Exibir o valor corretamente e sinalizar visualmente que as saídas superaram as entradas, sem impedir o registro. |
| Dados locais apagados pelo navegador | Informar na documentação que a primeira versão salva localmente e não possui backup automático. |
| Abertura em outro dispositivo ou navegador | Não prometer acesso aos mesmos dados até que sincronização em nuvem seja implementada. |
| Atualização de página durante preenchimento | Avisar sobre dados não salvos quando houver alterações no formulário. |
| Mais de um filtro aplicado | Aplicar os filtros de forma cumulativa, e não alternativa. |
| Valor muito alto | Aceitar valores dentro dos limites seguros de moeda, formatando-os corretamente sem perda de precisão. |

## 10. Requisitos não funcionais

- Moeda e datas devem seguir convenções brasileiras.
- O carregamento e as interações principais devem ser rápidos em conexões móveis comuns.
- A aplicação deve funcionar em versões recentes de navegadores móveis e desktop.
- Os cálculos devem evitar erros de ponto flutuante que possam causar diferenças em centavos.
- A interface deve deixar claro que o sistema é uma ferramenta de organização financeira pessoal e não substitui orientação contábil ou fiscal.

## 11. Próxima etapa recomendada

Após validar este PRD, definir a arquitetura da primeira versão: aplicação local no navegador ou aplicação com login e armazenamento em nuvem. Em seguida, elaborar o fluxo de telas antes da implementação.
