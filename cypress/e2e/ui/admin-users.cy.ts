import { fieldByLabel } from '../../support/pages/EmployeePages';

describe('OrangeHRM | Administração de usuários', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.intercept('GET', '**/api/v2/admin/users*').as('users');
    cy.visit('/web/index.php/admin/viewSystemUsers');
    cy.wait('@users');
  });

  it('ADM-01 buscar usuário do sistema pelo login', () => {
    fieldByLabel('Username').type(Cypress.env('adminUser') as string);
    cy.get('button[type="submit"]').click();
    cy.wait('@users');

    cy.get('.oxd-table-card').should('have.length.at.least', 1);
    cy.get('.oxd-table-card').each(($row) => {
      // A busca não diferencia maiúsculas de minúsculas
      expect($row.text().toLowerCase()).to.contain((Cypress.env('adminUser') as string).toLowerCase());
    });
  });

  it('ADM-02 busca por usuário inexistente informa "No Records Found"', () => {
    fieldByLabel('Username').type('usuario_inexistente_qa');
    cy.get('button[type="submit"]').click();
    cy.wait('@users');

    cy.contains('No Records Found').should('be.visible');
  });
});
