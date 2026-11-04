import { defineConfig } from 'cypress';

export default defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportPageTitle: 'Relatório de Testes | OrangeHRM',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
  },

  // Demo pública e compartilhada: pode ficar lenta em horários de pico
  retries: { runMode: 2, openMode: 0 },
  defaultCommandTimeout: 20000,
  requestTimeout: 30000,
  responseTimeout: 30000,
  pageLoadTimeout: 60000,

  video: false,
  screenshotOnRunFailure: true,
  viewportWidth: 1366,
  viewportHeight: 768,

  // Credenciais públicas exibidas na própria tela de login da demo.
  // Podem ser sobrescritas por variável de ambiente: CYPRESS_adminUser / CYPRESS_adminPassword
  env: {
    adminUser: 'Admin',
    adminPassword: 'admin123',
  },

  e2e: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
  },
});
