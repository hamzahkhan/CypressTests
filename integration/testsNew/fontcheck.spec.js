import { visit, validUser, invalidUser, login, increaseFont, decreaseFont, TestingUserData } from "../helper";
describe("LivChat Tests", () => {
  let orgfontsize;
  beforeEach(() => {
    login(Cypress.env("patient")["email"], Cypress.env("patient")["password"]);

    cy.waitUntil(() =>
      cy.window().then((win) => Object.keys(win.app.$store.getters["Common/threads"]).length > 0, {
        timeout: 10000,
        interval: 100,
      })
    );
    // assuming chats are present
    cy.window().then((w) => {
      cy.wrap(w.app.$store.getters["Common/threads"][0].group_id).as("chatId");
    });
  });

  context("Font size change", () => {
    it("Increase font size", () => {
      cy.get("@globalApp").then((app) => {
        cy.get("@chatId").then((chatId) => {
          visit("/" + "/user/chats/" + chatId, { timeout: 50000 }).then(() => {
            cy.waitUntil(() => cy.window().then((win) => win.single !== null, { timeout: 10000, interval: 100 }));
            cy.window().then((win) => {
              orgfontsize = win.single.fontSize;
            });
            increaseFont().click({ force: true });
            cy.window().then((win) => {
              cy.wrap(win.single.fontSize).should("be.gt", orgfontsize);
            });
            cy.window().then((win) => {
              orgfontsize = win.single.fontSize;
            });
            decreaseFont().click({ force: true });
            cy.window().then((win) => {
              cy.wrap(orgfontsize).should("be.gt", win.single.fontSize);
            });
          });
        });
      });
    });
  });
});
