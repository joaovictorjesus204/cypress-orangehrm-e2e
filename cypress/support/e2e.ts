import 'cypress-mochawesome-reporter/register';
import './commands';

// O OrangeHRM às vezes cancela requisições internas ao trocar de tela, gerando erros de
// JavaScript que não afetam o usuário. Só esses são ignorados; qualquer outro falha o teste.
Cypress.on('uncaught:exception', (err) => {
  if (/ResizeObserver|reading 'response'|canceled|Network Error/i.test(err.message)) return false;
  return undefined;
});
