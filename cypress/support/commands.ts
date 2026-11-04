import { loginPage } from './pages/LoginPage';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Login como administrador pela tela, com a sessão guardada em cache (cy.session). */
      loginAsAdmin(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginAsAdmin', () => {
  cy.session(
    'orangehrm-admin',
    () => {
      loginPage.visit().login(Cypress.env('adminUser') as string, Cypress.env('adminPassword') as string);
      cy.location('pathname', { timeout: 60000 }).should('include', '/dashboard');
    },
    {
      // Sessão só é reaproveitada se a API ainda aceitar o cookie
      validate() {
        cy.request({ url: '/web/index.php/api/v2/pim/employees?limit=1', failOnStatusCode: false })
          .its('status')
          .should('eq', 200);
      },
      cacheAcrossSpecs: true,
    },
  );
});

export {};
