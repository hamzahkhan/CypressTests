import { visit, validUser, invalidUser, login, get_app, sendMessage } from "../helper";

describe("LivChat Tests", () => {
  let quicktext;
  beforeEach(() => {
    login(Cypress.env("patient")["email"], Cypress.env("patient")["password"]);

    cy.waitUntil(() =>
      cy.window().then((win) => Object.keys(win.app.$store.getters["Common/threads"]).length > 0, {
        timeout: 10000,
        interval: 100,
      })
    );

    cy.window().then((w) => {
      cy.wrap(w.app.$store.getters["Common/threads"][0].group_id).as("chatId");
    });
  });

  context("Quicktext check for LivChat", () => {
    it("Quickchat message verify", () => {
      cy.get("@globalApp").then((app) => {
        cy.get("@chatId").then((chatId) => {
          visit("/" + "/user/chats/" + chatId, { timeout: 50000 }).then(() => {
            cy.waitUntil(() => cy.window().then((win) => win.single.loading === false, { timeout: 10000, interval: 100 }));
            cy.window().then((win) => {
              quicktext = app.$store.getters["Common/getQuickTexts"][0].text.slice(0, 2);
              cy.get("#typeMessage", { timeout: 1000 })
                .click()
                .type(quicktext)
                .then(() => {
                  cy.wrap(win.single.message).should("be.eq", quicktext);
                });
            });
          });
        });
      });
    });

    it("Quickchat message send", () => {
      cy.get("@globalApp").then((app) => {
        cy.get("@chatId").then((chatId) => {
          visit("/" + "/user/chats/" + chatId, { timeout: 50000 }).then(() => {
            cy.waitUntil(() => cy.window().then((win) => win.single.loading === false), { timeout: 10000, interval: 100 });
            cy.waitUntil(() => cy.window().then((win) => app.$store.getters["Common/getQuickTexts"] !== null), { timeout: 10000, interval: 100 });
            cy.get("#typeMessage", { timeout: 10000 })
              .click()
              .then(() => {
                cy.get("#quicktextOption-1", { timeout: 10000 })
                  .click()
                  .then(() => {
                    cy.window().then((win) => {
                      cy.wrap(win.single.message, { timeout: 10000 }).as("textboxMessage");
                      cy.get("@textboxMessage").then((textboxMessage) => {
                        if (Object.values(app.$store.getters["Common/getQuickTexts"]).filter((en) => en.text === textboxMessage).length > 0) {
                          sendMessage().click();
                        }
                      });
                    });
                  });
              });
          });
        });
      });
    });
  });
});
