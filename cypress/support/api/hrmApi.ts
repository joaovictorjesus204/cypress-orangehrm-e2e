/**
 * Cliente da API REST interna do OrangeHRM (a mesma que a tela usa).
 * As chamadas usam o cookie da sessão aberta no navegador, então o login vem antes.
 */
const API = '/web/index.php/api/v2';

export interface NewEmployee {
  firstName: string;
  lastName: string;
  employeeId: string;
}

export interface EmployeeListResponse {
  data: Array<{ empNumber: number; firstName: string; lastName: string; employeeId: string }>;
  meta: { total: number };
}

export const HrmApi = {
  createEmployee(employee: NewEmployee) {
    return cy
      .request<{ data: { empNumber: number } }>({
        method: 'POST',
        url: `${API}/pim/employees`,
        body: { ...employee, middleName: '', empPicture: null },
      })
      .then((response) => response.body.data.empNumber);
  },

  getPersonalDetails(empNumber: number) {
    return cy.request<{ data: { firstName: string; lastName: string; employeeId: string } }>({
      url: `${API}/pim/employees/${empNumber}/personal-details`,
      failOnStatusCode: false,
    });
  },

  searchEmployees(nameOrId: string) {
    return cy.request<EmployeeListResponse>({
      url: `${API}/pim/employees`,
      qs: { nameOrId, limit: 50, offset: 0, includeEmployees: 'onlyCurrent' },
      failOnStatusCode: false,
    });
  },

  deleteEmployees(empNumbers: number[]) {
    return cy.request({
      method: 'DELETE',
      url: `${API}/pim/employees`,
      body: { ids: empNumbers },
      failOnStatusCode: false,
    });
  },
};
