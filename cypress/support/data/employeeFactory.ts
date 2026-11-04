import { faker } from '@faker-js/faker';
import { NewEmployee } from '../api/hrmApi';

const lettersOnly = (value: string) => value.replace(/[^A-Za-z]/g, '');

/**
 * Funcionário com dados únicos: a demo é compartilhada por muita gente,
 * então nome e matrícula aleatórios evitam colisão com dados de terceiros.
 */
export function buildEmployee(): NewEmployee {
  return {
    firstName: `Qa${lettersOnly(faker.person.firstName())}`,
    lastName: lettersOnly(faker.person.lastName()),
    employeeId: faker.string.numeric(8),
  };
}
