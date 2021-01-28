describe("Screenshot tests", () => {
  beforeEach(() => {
    cy.visit("/screenshot-tool");
    cy.window().its("store").invoke("dispatch", { type: "RESET_APP_STATE" });
  });

  it("Tests that you can delete a screenshot", () => {
    cy.addPlaceholderScreenshot();
    cy.get(".ant-menu-submenu-title").click({ force: true });
    cy.get(".ant-menu-item").click({ force: true });
    cy.get(".screenshot__delete").first().click();
    cy.get(".screenshot").should("not.exist");
  });
});
