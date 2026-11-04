import { HrmApi } from '../../support/api/hrmApi';
import { buildEmployee } from '../../support/data/employeeFactory';

/**
 * Testes direto na API REST do OrangeHRM (sem tela), usando a sessão do administrador.
 * São mais rápidos e estáveis que os de interface e cobrem as regras do back-end.
 */
describe('OrangeHRM | API de funcionários', () => {
  let createdIds: number[] = [];

  afterEach(() => {
    if (createdIds.length) {
      cy.loginAsAdmin();
      HrmApi.deleteEmployees(createdIds);
    }
    createdIds = [];
  });

  it('API-01 sem sessão a API recusa o acesso (401)', () => {
    cy.clearAllCookies();
    cy.request({ url: '/web/index.php/api/v2/pim/employees', failOnStatusCode: false })
      .its('status')
      .should('eq', 401);
  });

  it('API-02 criar funcionário e consultar os dados pessoais', () => {
    cy.loginAsAdmin();
    const employee = buildEmployee();

    HrmApi.createEmployee(employee).then((empNumber) => {
      createdIds.push(Number(empNumber));

      HrmApi.getPersonalDetails(Number(empNumber)).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.include({
          firstName: employee.firstName,
          lastName: employee.lastName,
          employeeId: employee.employeeId,
        });
      });
    });
  });

  it('API-03 listagem filtrada pela matrícula encontra o funcionário criado', () => {
    cy.loginAsAdmin();
    const employee = buildEmployee();

    HrmApi.createEmployee(employee).then((empNumber) => {
      createdIds.push(Number(empNumber));

      HrmApi.searchEmployees(employee.employeeId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.meta.total).to.eq(1);
        expect(response.body.data[0].empNumber).to.eq(Number(empNumber));
      });
    });
  });

  it('API-04 excluir funcionário remove o registro da listagem', () => {
    cy.loginAsAdmin();
    const employee = buildEmployee();

    HrmApi.createEmployee(employee).then((empNumber) => {
      HrmApi.deleteEmployees([Number(empNumber)]).its('status').should('eq', 200);
      HrmApi.searchEmployees(employee.employeeId).then((response) => response.body.meta.total).should('eq', 0);
    });
  });
});
