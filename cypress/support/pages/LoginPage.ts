class LoginPage {
  readonly path = '/web/index.php/auth/login';

  visit() {
    cy.visit(this.path);
    return this;
  }

  fill(username: string, password: string) {
    if (username) cy.get('input[name="username"]').type(username);
    if (password) cy.get('input[name="password"]').type(password, { log: false });
    return this;
  }

  submit() {
    cy.get('button[type="submit"]').click();
    return this;
  }

  login(username: string, password: string) {
    return this.fill(username, password).submit();
  }

  alert() {
    return cy.get('.oxd-alert-content-text');
  }

  requiredMessages() {
    return cy.get('.oxd-input-field-error-message');
  }

  isDisplayed() {
    cy.location('pathname').should('eq', this.path);
    cy.get('input[name="username"]').should('be.visible');
    return this;
  }
}

export const loginPage = new LoginPage();
