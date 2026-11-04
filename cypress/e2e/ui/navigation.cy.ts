import { layout } from '../../support/pages/Layout';

describe('OrangeHRM | Navegação pelos módulos', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/web/index.php/dashboard/index');
    layout.pageTitle().should('have.text', 'Dashboard');
  });

  const modules = [
    { name: 'Admin', path: '/admin/' },
    { name: 'PIM', path: '/pim/' },
    { name: 'Leave', path: '/leave/' },
    { name: 'Time', path: '/time/' },
    { name: 'Recruitment', path: '/recruitment/' },
    { name: 'Directory', path: '/directory/' },
  ];

  modules.forEach(({ name, path }) => {
    it(`NAV-01 menu lateral abre o módulo ${name}`, () => {
      layout.openModule(name);

      cy.location('pathname').should('include', path);
      cy.get('.oxd-topbar-header-breadcrumb').should('contain.text', name);
    });
  });

  it('NAV-02 busca do menu filtra os módulos pelo nome', () => {
    layout.searchMenu('Recr');

    layout.menuItems().should('have.length', 1).and('contain.text', 'Recruitment');
  });

  it('NAV-03 Dashboard exibe os painéis principais', () => {
    cy.contains('.orangehrm-dashboard-widget', 'Quick Launch').should('be.visible');
    cy.contains('.orangehrm-dashboard-widget', 'My Actions').should('be.visible');
  });
});
