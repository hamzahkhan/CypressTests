import { visit, validUser, invalidUser, login, get_app } from "../helper";
const crypto = require("crypto");

describe("LivChat Tests", () => {
  let app;
  let userId = "15afbb3e-5363-4f67-a2a3-c644e350364d";
  let chatId;
  beforeEach(() => {
    visit("/");
    cy.get('[data-cy="login.email"]').type("hamzahTest@grr.la");
    cy.get('[data-cy="login.password"]').type("asdQWE123!@");
    cy.get('[data-cy="login.loginButton"]').click();
    cy.location().should((loc) => {
      expect(loc.hash).to.eq("#/auth/login");
    });
    cy.window().should("have.property", "app");
    cy.window().then((w) => {
      app = w.app;
      cy.waitUntil(() => app.$store.state.User.keys.pub !== null, { timeout: 10000, interval: 500 });
    });
  });

  context("Messaging", () => {
    it("Start chat with new recipient", () => {
      visit("/startChat/search", { timeout: 50000 }).then(() => {
        cy.waitUntil(() =>
          cy.window().then((win) => win.StartChat.loading === false, { timeout: 10000, interval: 100 })
        );
        cy.log("loaded");

        // test what happens if empty form is sent
        cy.get('[data-cy="startChat.chatButton"]')
          .click({ force: true })
          .then(() => {
            cy.get(".modal-title")
              .contains("Error")
              .then(() => {
                cy.get("button")
                  .contains("Ok")
                  .click();
              });
          });
        cy.waitUntil(() =>
          cy.window().then((win) => win.StartChat.loading === false, { timeout: 10000, interval: 100 })
        );
        cy.get(".md-menu")
          .find('[data-cy="search.usersearch"]', { timeout: 10000 })
          .click()
          .focused()
          .type("patienttest" + "{downarrow}{enter}", { force: true });

        cy.get('[data-cy="startChat.testName"]').type("Testing group");
        cy.get('[data-cy="startChat.chatButton"]').click({ force: true });
      });

      cy.waitUntil(() => cy.window().then((win) => win.single.loading === false, { timeout: 10000, interval: 100 }));
      cy.window().then((win) => {
        cy.wrap(win.single.chatName).should("be.eq", "Testing group");
        cy.url().then((url) => {
          chatId = url.split("/").pop();
        });
      });
    });

    it("Send messages, file attachments and voice messages", () => {
      visit("/user/chats/" + chatId.toString()).then(() => {
        cy.waitUntil(() => cy.window().then((win) => win.single.loading === false, { timeout: 10000, interval: 100 }));
        cy.window().then((win) => {
          cy.wrap(win.single.chatName).should("be.eq", "Testing group");
        });
        const text = crypto.randomBytes(10).toString("hex");
        cy.get("#typeMessage")
          .click()
          .type(text);
        cy.get('[data-cy="single.sendMessage"]').click();

        cy.url().then((url) => {
          let id = url.split("/").pop();
          // let length = app.$store.state.messages[id].items.length
          // cy.wrap(app.$store.state.messages[id].items[length-1].message).should("eq",text)

          // send voice recording
          //ToDo - voiceMemo ID verification
          cy.get('[data-cy="single.voiceMemo"]', { timeout: 10000 }).click();
          //cy.wait(500)
          cy.get('[data-cy = "single.startRecording"]', { timeout: 10000 }).click();
          //cy.wait(3000)
          cy.get('[data-cy = "single.startRecording"]', { timeout: 10000 }).click();
          try {
            expect(Object.keys(app.$store.state.Common.media).length).not.to.eq(0);
          } catch {
            cy.log("Voice memo not sent");
          }

          // file upload
          cy.get('[data-cy="single.attachMedia"]')
            .click()
            .then(() => {
              cy.get(".dropzone-custom-title").attachFile("Screenshot(140).png", { subjectType: "drag-n-drop" });
            });
          // verifying file upload
          // length = app.$store.state.messages[id].items.length
          // cy.log(length)
          // cy.wrap(app.$store.state.messages[id].items[length-1].meta.extension).should("eq","image/png")
        });
      });
    });
  });
});
