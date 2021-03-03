// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import "cypress-fill-command";

Cypress.Commands.add("addUrlToUrlList", (url) => {
  cy.window().its("store").invoke("dispatch", {
    type: "ADD_URL_TO_URL_LIST",
    url,
  });
});

Cypress.Commands.add("addPlaceholderScreenshot", () => {
  cy.window()
    .its("store")
    .invoke("dispatch", {
      type: "ADD_SCREENSHOT",
      screenshot: {
        deviceName: "iPhone 5/SE",
        image: "example",
        id: "1",
        url: new URL("https://example.com"),
        status: "running",
      },
    });
});
