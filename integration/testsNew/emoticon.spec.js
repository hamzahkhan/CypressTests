import { visit, validUser, invalidUser, login, EmojiSelect, stickerSelect, sendMessage, emoticonCSS, stickerCSS } from "../helper";

describe("LivChat Tests", () => {
  let chatmessages;
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

  context("emoticon and reactions check LivChat", () => {
    it("emoticon testing on Livchat", () => {
      cy.get("@globalApp").then((app) => {
        cy.get("@chatId").then((chatId) => {
          visit("/" + "/user/chats/" + chatId, { timeout: 50000 }).then(() => {
            cy.waitUntil(() => cy.window().then((win) => win.single.loading === false, { timeout: 10000, interval: 100 }));
            EmojiSelect()
              .click({ force: true })
              .then(() => {
                emoticonCSS()
                  .click({ force: true })
                  .then(() => {
                    cy.window().then((win) => {
                      cy.log("checking if emoticon in message box", win.single.message);
                    });
                  });
              });
          });
        });
      });
    });

    it("sticker testing on Livchat", () => {
      cy.get("@globalApp").then((app) => {
        cy.get("@chatId").then((chatId) => {
          visit("/" + "/user/chats/" + chatId, { timeout: 50000 }).then(() => {
            cy.waitUntil(() => cy.window().then((win) => win.single.loading === false, { timeout: 10000, interval: 100 }));
            cy.window().then((win) => {
              chatmessages = win.single.messages.length;
            });
            stickerSelect()
              .click({ force: true })
              .then(() => {
                stickerCSS()
                  .click({ force: true })
                  .then(() => {
                    sendMessage().click();
                  });
              });

            cy.waitUntil(() => cy.window().then((win) => win.single.loading === false, { timeout: 10000, interval: 100 }));
            cy.waitUntil(() =>
              cy.window().then((win) => app.$store.state.Common.messages[chatId].length > chatmessages, {
                timeout: 10000,
                interval: 100,
              })
            );
            cy.window().then((win) => {
              cy.wrap(win.single.messages.slice(-1)[0].meta)
                .its("sticker")
                .should("be.eq", true);
            });
          });
        });
      });
    });
  });
});
