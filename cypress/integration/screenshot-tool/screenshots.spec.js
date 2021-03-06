describe("Screenshot tests", () => {
  beforeEach(() => {
    cy.visit("/screenshot-tool");
    cy.window().its("store").invoke("dispatch", { type: "RESET_APP_STATE" });
  });

  it("Tests that you can delete a screenshot with the delete button", () => {
    cy.addPlaceholderScreenshot();
    cy.get("[data-cy='screenshot-bar-submenu'] > div").first().click({
      force: true,
    });
    cy.get("[data-cy='screenshot-bar-menu-item']").click({ force: true });
    cy.get('[data-cy="screenshot-delete-button"]').click({ force: true });
    cy.get("[data-cy='screenshot']").should("not.exist");
  });

  it("Tests that you can delete a screenshot with the submenu", () => {
    cy.addPlaceholderScreenshot();
    cy.get("[data-cy='screenshot-bar-submenu'] > div").first().click({
      force: true,
    });
    cy.get("[data-cy='screenshot-bar-menu-item']").click({ force: true });
    cy.get("[data-cy='screenshot-menu-button']").click({ force: true });
    cy.get("[data-cy='screenshot-menu-delete']").click({ force: true });
    cy.get("[data-cy='screenshot']").should("not.exist");
  });

  it("Tests that you can take a screenshot", () => {});
});
