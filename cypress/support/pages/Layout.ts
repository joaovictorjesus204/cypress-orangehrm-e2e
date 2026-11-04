/** Elementos comuns a todas as telas internas: cabeçalho, menu lateral e menu do usuário. */
class Layout {
  pageTitle() {
    return cy.get('.oxd-topbar-header-breadcrumb h6').first();
  }

  menuItems() {
    return cy.get('.oxd-main-menu-item');
  }

  openModule(name: string) {
    cy.contains('.oxd-main-menu-item', name).click();
  }

  searchMenu(text: string) {
    cy.get('.oxd-main-menu-search input').type(text);
  }

  logout() {
    cy.get('.oxd-userdropdown-tab').click();
    cy.contains('.oxd-userdropdown-link', 'Logout').click();
  }

  toast() {
    return cy.get('.oxd-toast', { timeout: 20000 });
  }
}

export const layout = new Layout();
