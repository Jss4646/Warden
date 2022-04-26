describe("URL List Tests", () => {
  const testingUrl = "https://angrycreative.com";
  const invalidUrl = "Invalid Url";

  beforeEach(() => {
    cy.visit("/");
    cy.resetAppState();
    cy.get("#url-list-dropdown").click();
  });

  it("Tests that you can add a url to the url list", () => {
    cy.get("#url-bar-input").type(testingUrl);
    cy.get("#add-url-button").click();
    cy.get("#url-list").contains(testingUrl);
  });

  it("Tests that you can't add an invalid url to the url list", () => {
    cy.get("#url-bar-input").clear().type(invalidUrl);
    cy.get("#add-url-button").click();
    cy.get("#url-list").should("not.contain", invalidUrl);
  });

  it("Tests that you can crawl a url", () => {
    cy.intercept(
      {
        method: "POST",
        url: "/api/crawl-url",
      },
      { url: `${testingUrl}/sitemap.xml`, sites: [`${testingUrl}/success`] }
    ).as("crawlUrl");

    cy.get("#url-bar-input").type(testingUrl);
    cy.get("#crawl-url-button").click();
    cy.get("#url-list").contains(`${testingUrl}/success`);
  });

  it("Tests that you can't crawl an invalid url", () => {
    cy.intercept({
      method: "POST",
      url: "/api/crawl-url",
    }).as("crawlUrl");

    cy.get("#url-bar-input").clear().type(invalidUrl);
    cy.get("#crawl-url-button").click();
    cy.get("#url-list").should("not.contain", invalidUrl);

    cy.get("@crawlUrl").then((stub) => expect(stub).to.eq(null));
  });

  it("Tests that the Clear URLs button works", () => {
    cy.addUrlToUrlList(testingUrl);
    cy.get("#clear-urls-button").click();
    cy.get("#url-list").should("not.contain", testingUrl);
  });
});
