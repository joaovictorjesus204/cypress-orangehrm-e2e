# Cypress + TypeScript | OrangeHRM

[![Testes Cypress OrangeHRM](https://github.com/joaovictorjesus204/cypress-orangehrm-e2e/actions/workflows/cypress.yml/badge.svg)](https://github.com/joaovictorjesus204/cypress-orangehrm-e2e/actions/workflows/cypress.yml)

Automação de testes **E2E e de API** com **Cypress e TypeScript** no **[OrangeHRM](https://www.orangehrm.com/)**, sistema de gestão de RH de código aberto usado por empresas no mundo todo. Os testes rodam na [demo oficial pública](https://opensource-demo.orangehrmlive.com) mantida pelo próprio fabricante.

Autor: João Victor de Jesus

---

## Números

| | |
|---|---|
| Cenários | 25 (21 de interface e 4 de API) |
| Módulos cobertos | Login, Dashboard, PIM (funcionários), Admin, Leave, Time, Recruitment e Directory |
| Execução automática | A cada push e diariamente, nos dias úteis, pelo GitHub Actions |
| Relatório | HTML com gráficos e prints de falha, publicado como artefato em cada execução |

---

## Como rodar

Pré-requisito: **Node.js 20 ou superior**.

```bash
git clone https://github.com/joaovictorjesus204/cypress-orangehrm-e2e.git
cd cypress-orangehrm-e2e
npm install
npm test
```

Relatório: abra `cypress/reports/index.html` no navegador.

| Comando | O que faz |
|---|---|
| `npm test` | Roda todos os testes sem abrir tela |
| `npm run test:ui` | Só os testes de interface |
| `npm run test:api` | Só os testes de API |
| `npm run typecheck` | Verifica os tipos do TypeScript |

### Ver os testes rodando na tela

| Comando | O que faz |
|---|---|
| `npm run test:headed` | Assiste todos os testes rodando sozinhos no Chrome |
| `npm run cy:open` | Modo interativo: escolhe o arquivo, assiste e "volta no tempo" em cada passo |

---

## Cobertura

| ID | Cenário | Tipo | Prioridade |
|---|---|---|---|
| HRM-01 | Login de administrador abre o Dashboard | UI | P1 |
| HRM-02 | Senha incorreta exibe "Invalid credentials" | UI | P1 |
| HRM-03 | Campos em branco exibem "Required" | UI | P1 |
| HRM-04 | Página interna sem login redireciona para o login | UI, segurança | P1 |
| HRM-05 | Logout encerra a sessão e bloqueia a área interna | UI, segurança | P1 |
| HRM-06 | "Forgot your password?" abre a tela de redefinição | UI | P3 |
| NAV-01 | Menu lateral abre cada módulo (6 módulos) | UI, orientado a dados | P2 |
| NAV-02 | Busca do menu filtra os módulos | UI | P3 |
| NAV-03 | Dashboard exibe os painéis principais | UI | P2 |
| EMP-01 | Cadastrar funcionário pela tela e confirmar pela API | UI + API | P1 |
| EMP-02 | Cadastro sem campos obrigatórios exibe "Required" | UI | P1 |
| EMP-03 | Buscar funcionário pela matrícula | UI | P1 |
| EMP-04 | Busca sem resultado informa "No Records Found" | UI | P2 |
| EMP-05 | Excluir funcionário pela tela | UI + API | P1 |
| ADM-01 | Buscar usuário do sistema | UI | P2 |
| ADM-02 | Busca de usuário inexistente | UI | P3 |
| API-01 | API sem sessão responde 401 | API, segurança | P1 |
| API-02 | Criar funcionário e consultar dados pessoais | API | P1 |
| API-03 | Listagem filtrada encontra o funcionário criado | API | P1 |
| API-04 | Excluir funcionário remove o registro | API | P1 |

---

## Decisões técnicas

| Decisão | Por quê |
|---|---|
| **Sistema real em vez de site de treino** | O OrangeHRM é um produto usado por empresas, com regras de negócio, permissões e API de verdade |
| **Interface + API no mesmo teste** | O cadastro é feito pela tela e conferido direto na API (EMP-01). Valida o que o usuário vê e o que foi gravado |
| **Massa de dados criada pela API** | Para testar busca e exclusão, o funcionário é criado pela API em segundos, sem depender da tela de cadastro |
| **Limpeza automática (`afterEach`)** | A demo é compartilhada. Todo funcionário criado pelo teste é apagado no final, mesmo se o teste falhar |
| **Dados únicos com Faker** | Nome e matrícula aleatórios evitam colisão com dados de outros usuários da demo |
| **Login com `cy.session`** | O login pela tela é testado nos specs de login. Nos demais, a sessão fica em cache e é validada pela API antes de ser reaproveitada |
| **Espera pela API (`cy.intercept` + `cy.wait`)** | O teste espera a resposta real da busca, em vez de esperar um tempo fixo |
| **Campos localizados pelo rótulo** (`Employee Id`, `Username`) | Mesma forma que o usuário encontra o campo; resiste a mudanças de layout |
| **Timeouts maiores e `retries` no CI** | A demo é pública e pode ficar lenta em horário de pico |
| **Execução diária agendada** | Detecta mudança no sistema mesmo sem commit novo |

---

## Limitações

- A demo é pública e compartilhada: outras pessoas criam e apagam dados ao mesmo tempo. Os testes só validam o que eles mesmos criam.
- A demo é reiniciada periodicamente pelo fabricante; credenciais e dados de exemplo podem mudar. As credenciais podem ser trocadas por variável de ambiente (`CYPRESS_adminUser`, `CYPRESS_adminPassword`).
- O OrangeHRM às vezes cancela requisições internas ao trocar de tela, gerando erros de JavaScript sem impacto para o usuário. Só esses erros específicos são ignorados (`cypress/support/e2e.ts`).

## Próximos passos

- Fluxos completos de férias (solicitar, aprovar e rejeitar) com dois perfis de usuário.
- Testes de permissão: usuário comum não acessa o módulo Admin.
- Upload de foto do funcionário e validação de formatos aceitos.
