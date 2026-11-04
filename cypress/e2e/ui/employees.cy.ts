import { HrmApi } from '../../support/api/hrmApi';
import { buildEmployee } from '../../support/data/employeeFactory';
import { addEmployeePage, employeeListPage } from '../../support/pages/EmployeePages';
import { layout } from '../../support/pages/Layout';

/**
 * Cadastro de funcionários (módulo PIM).
 * Ambiente compartilhado: todo funcionário criado pelo teste é apagado no afterEach.
 */
describe('OrangeHRM | Funcionários (PIM)', () => {
  let createdIds: number[] = [];

  beforeEach(() => {
    cy.loginAsAdmin();
  });

  afterEach(() => {
    if (createdIds.length) HrmApi.deleteEmployees(createdIds);
    createdIds = [];
  });

  it('EMP-01 cadastrar funcionário pela tela e confirmar os dados pela API', () => {
    const employee = buildEmployee();

    addEmployeePage.visit().fill(employee).save();

    layout.toast().should('contain.text', 'Successfully Saved');
    cy.location('pathname').should('include', '/pim/viewPersonalDetails/empNumber/');
    cy.contains('.orangehrm-edit-employee-name', `${employee.firstName} ${employee.lastName}`).should('be.visible');

    cy.location('pathname').then((pathname) => {
      const empNumber = Number(pathname.split('/').pop());
      createdIds.push(empNumber);

      HrmApi.getPersonalDetails(empNumber).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.firstName).to.eq(employee.firstName);
        expect(response.body.data.lastName).to.eq(employee.lastName);
        expect(response.body.data.employeeId).to.eq(employee.employeeId);
      });
    });
  });

  it('EMP-02 cadastro sem nome e sobrenome exibe "Required"', () => {
    addEmployeePage.visit().save();

    addEmployeePage.requiredMessages().should('have.length.at.least', 2).and('contain.text', 'Required');
    cy.location('pathname').should('eq', addEmployeePage.path);
  });

  it('EMP-03 buscar funcionário pela matrícula na lista', () => {
    const employee = buildEmployee();
    HrmApi.createEmployee(employee).then((empNumber) => createdIds.push(Number(empNumber)));

    employeeListPage.visit().searchById(employee.employeeId);

    employeeListPage.row(employee.employeeId).should('contain.text', employee.firstName);
    cy.get('.oxd-table-card').should('have.length', 1);
  });

  it('EMP-04 busca por matrícula inexistente informa "No Records Found"', () => {
    employeeListPage.visit().searchById('99999999');

    cy.contains('No Records Found').should('be.visible');
    cy.get('.oxd-table-card').should('not.exist');
  });

  it('EMP-05 excluir funcionário pela tela', () => {
    const employee = buildEmployee();
    HrmApi.createEmployee(employee).then((empNumber) => createdIds.push(Number(empNumber)));

    employeeListPage.visit().searchById(employee.employeeId).deleteRow(employee.employeeId);

    layout.toast().should('contain.text', 'Successfully Deleted');
    HrmApi.searchEmployees(employee.employeeId).then((response) => response.body.meta.total).should('eq', 0);
  });
});
