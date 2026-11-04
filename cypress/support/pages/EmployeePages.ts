import { NewEmployee } from '../api/hrmApi';

/** Campo de formulário localizado pelo rótulo visível, como o usuário enxerga a tela. */
const fieldByLabel = (label: string) => cy.contains('.oxd-input-group', label).find('input');

class AddEmployeePage {
  readonly path = '/web/index.php/pim/addEmployee';

  visit() {
    cy.visit(this.path);
    cy.get('input[name="firstName"]').should('be.visible');
    return this;
  }

  fill(employee: NewEmployee) {
    cy.get('input[name="firstName"]').type(employee.firstName);
    cy.get('input[name="lastName"]').type(employee.lastName);
    fieldByLabel('Employee Id').clear().type(employee.employeeId);
    return this;
  }

  save() {
    cy.get('button[type="submit"]').click();
    return this;
  }

  requiredMessages() {
    return cy.get('.oxd-input-field-error-message');
  }
}

class EmployeeListPage {
  readonly path = '/web/index.php/pim/viewEmployeeList';

  visit() {
    cy.intercept('GET', '**/api/v2/pim/employees*').as('listEmployees');
    cy.visit(this.path);
    cy.wait('@listEmployees');
    return this;
  }

  searchById(employeeId: string) {
    cy.intercept('GET', '**/api/v2/pim/employees*').as('searchEmployees');
    fieldByLabel('Employee Id').clear().type(employeeId);
    cy.get('button[type="submit"]').click();
    cy.wait('@searchEmployees');
    return this;
  }

  row(text: string) {
    return cy.contains('.oxd-table-card', text);
  }

  deleteRow(text: string) {
    this.row(text).find('.bi-trash').closest('button').click();
    cy.contains('.orangehrm-modal-footer button', 'Yes, Delete').click();
    return this;
  }
}

export const addEmployeePage = new AddEmployeePage();
export const employeeListPage = new EmployeeListPage();
export { fieldByLabel };
