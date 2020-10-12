import { visit, validUser, invalidUser, login, get_app, sendMessage, recoveryOTP, recoveryPswd, recoveryPswdRepeat } from "../helper";
const crypto = require("crypto");
const guerrillaMailApi = require("guerrillamail-api");
const GuerrillaApi = new guerrillaMailApi.GuerrillaMailApi({
  emailUser: Cypress.env("patient")["email"],
  pollInterval: 15000,
});

// asumption - recovery process complete

describe("LivChat Tests", () => {
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

  context("Recovery process", () => {
    it("Recovery process", () => {
      cy.get("@globalApp").then((app) => {
        cy.wrap(app.$store.getters["User/recoverySetupDone"]).should("be.eq", true);
        cy.get("@chatId").then((chatId) => {
          visit("/" + "/user/chats/" + chatId, { timeout: 50000 }).then(() => {
            cy.waitUntil(() => cy.window().then((win) => win.single.loading === false), { timeout: 10000, interval: 100 });
            const text = crypto.randomBytes(10).toString("hex");
            cy.get("#typeMessage", { timeout: 1000 })
              .click()
              .type(text)
              .then(() => {
                sendMessage().click();
              });
            cy.window().then((win) => {
              cy.wrap(win.single.messages.slice(-1)[0].message).as("lastMessage");
            });
          });
          cy.get('[data-cy="MainNavbar.Logout"]')
            .click()
            .then(() => {
              // cy.waitUntil(() => app.$store.state.User.keys.pub === null, { timeout: 15000, interval: 500 });

              // recovery process start
              //let email = "HamzahNe@grr.la";
              cy.get('[href="#/auth/forgot"] > .md-ripple > .md-button-content')
                .click()
                .then(() => {
                  cy.get('[data-cy="forgot.email"]')
                    .type(Cypress.env("patient")["email"])
                    .then(() => {
                      cy.get('[data-cy="forgot.startRecovery"]').click();
                    });

                  GuerrillaApi.on("newEmail", (newEmails) => {
                    GuerrillaApi.fetchEmail(789).then((result) => {
                      cy.log(result);
                    });
                    // Do stuff with the new emails
                  });
                  //   cy.createInbox().then((inbox) => {
                  //     assert.isDefined(inbox);
                  //     let inboxId = inbox.id;
                  //     emailAddress = inbox.emailAddress;
                  //     let code;

                  //     cy.waitForLatestEmail(inboxId).then((email) => {
                  //       cy.log(inboxId);
                  //       assert.isDefined(email);
                  //       code = /([0-9]{6})$/.exec(email.body.split(".")[0])[1];
                  //       assert.isDefined(code);

                  //       // password = "testPassword!2#";
                  //       // const userName = "signup-tester2";
                  //       recoveryOTP()
                  //         .type(code)
                  //         .then(() => {
                  //           recoveryPswd()
                  //             .type(TestingUserData["patient"]["password"])
                  //             .then(() => {
                  //               recoveryPswdRepeat()
                  //                 .type(TestingUserData["patient"]["password"])
                  //                 .then(() => {
                  //                   cy.get('[data-cy=".md-primary > .md-ripple"]').click();
                  //                 });
                  //             });
                  //         });
                  //     });
                  //   });
                  cy.wait(2000);
                });
            });
        });
      });
    });
  });
});
