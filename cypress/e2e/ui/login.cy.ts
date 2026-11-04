import { loginPage } from '../../support/pages/LoginPage';
import { layout } from '../../support/pages/Layout';

const ADMIN = () => ({ user: Cypress.env('adminUser') as string, password: Cypress.env('adminPassword') as string });

describe('OrangeHRM | Login e sessão', () => {
  beforeEach(() => {
    loginPage.visit();
  });

  it('HRM-01 login de administrador abre o Dashboard', () => {
    loginPage.login(ADMIN().user, ADMIN().password);

    cy.location('pathname', { timeout: 60000 }).should('include', '/dashboard/index');
    layout.pageTitle().should('have.text', 'Dashboard');
  });

  it('HRM-02 senha incorreta exibe "Invalid credentials" e mantém na tela de login', () => {
    loginPage.login(ADMIN().user, 'senha-incorreta');

    loginPage.alert().should('have.text', 'Invalid credentials');
    loginPage.isDisplayed();
  });

  it('HRM-03 campos em branco exibem "Required" em usuário e senha', () => {
    loginPage.submit();

    loginPage.requiredMessages().should('have.length', 2).each(($msg) => {
      cy.wrap($msg).should('have.text', 'Required');
    });
  });

  it('HRM-04 página interna sem login redireciona para o login', () => {
    cy.clearAllCookies();
    cy.visit('/web/index.php/pim/viewEmployeeList');

    loginPage.isDisplayed();
  });

  it('HRM-05 logout encerra a sessão e bloqueia a área interna', () => {
    loginPage.login(ADMIN().user, ADMIN().password);
    cy.location('pathname', { timeout: 60000 }).should('include', '/dashboard');

    layout.logout();
    loginPage.isDisplayed();

    cy.visit('/web/index.php/dashboard/index');
    loginPage.isDisplayed();
  });

  it('HRM-06 "Forgot your password?" abre a tela de redefinição', () => {
    cy.contains('Forgot your password?').click();

    cy.location('pathname').should('include', '/requestPasswordResetCode');
    cy.contains('h6', 'Reset Password').should('be.visible');
  });
});
