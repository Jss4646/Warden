describe("Screenshot tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.resetAppState();
  });

  it("Tests that you can delete a screenshot with the delete button", () => {
    cy.addPlaceholderScreenshot();
    openScreenshotTab();
    cy.get('[data-cy="screenshot-delete-button"]').click({ force: true });
    cy.get("[data-cy='screenshot']").should("not.exist");
  });

  it("Tests that you can take a screenshot", () => {
    cy.intercept("/api/take-screenshot").as("screenshot");
    cy.get('[data-cy="url-bar"]').type("https://angrycreative.com");
    cy.get('[data-cy="take-screenshot"]').click();

    openScreenshotTab();
    cy.get("[data-cy='screenshot-bar-submenu'] > div")
      .first()
      .should("contain.text", "angrycreative.com");

    cy.get("[data-cy='screenshot-bar-menu-item']").should("have.text", "/");

    cy.wait("@screenshot");

    cy.get("[data-cy='screenshot-image']").should("exist");
  });
});

function openScreenshotTab() {
  cy.get("[data-cy='screenshot-bar-submenu'] > div").first().click({
    force: true,
  });
  cy.get("[data-cy='screenshot-bar-menu-item']").click({ force: true });
}
