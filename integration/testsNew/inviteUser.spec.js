import {
  visit,
  validUser,
  invalidUser,
  login,
  passwordElement,
  InviteTab,
  LoginButton,
  InviteUserNext,
  registerName,
  registerEmail,
  registerPassword,
  registerConfirmPswd,
  registerButton,
  confirmOTP,
  confirmButton,
  emailElement,
} from "../helper";
describe("LivChat Tests", () => {
  let inviteURL, emailAddress, password;

  context("Invite user to LivChat", () => {
    it("Token generation", () => {
      login(Cypress.env("patient")["email"], Cypress.env("patient")["password"]);
      cy.waitUntil(() =>
        cy.window().then((win) => Object.keys(win.app.$store.getters["Common/threads"]).length > 0, {
          timeout: 10000,
          interval: 100,
        })
      );
      cy.get("@globalApp").then((app) => {
        InviteTab()
          .click()
          .then(() => {
            cy.get(".md-menu")
              .get("#inviteOption-1")
              .click({ force: true })
              .then(() => {
                InviteUserNext().click({ force: true });
              })
              .then(() => {
                cy.waitUntil(() => cy.window().then((win) => !!win.MainNavbar), { timeout: 10000, interval: 100 }).then(() => {
                  cy.window().then((win) => {
                    cy.wrap(win.MainNavbar.token.token)
                      .its("length")
                      .should("be.gte", 1)
                      .then(() => {
                        inviteURL = win.MainNavbar.invitationUrl;
                        cy.log(inviteURL);
                      });
                  });
                });
              });
          });
      });
    });

    it("Signup with token", () => {
      visit(inviteURL, { timeout: 10000 }).then(() => {
        cy.location({ timeout: 10000 }).should((loc) => {
          expect(loc.href).to.eq(inviteURL);
        });
        cy.createInbox().then((inbox) => {
          assert.isDefined(inbox);

          let inboxId = inbox.id;
          emailAddress = inbox.emailAddress;
          password = "testPassword!2#";
          const userName = "signup-tester2";
          let code;
          registerName()
            .type(userName)
            .then(() => {
              registerEmail()
                .type(emailAddress)
                .then(() => {
                  registerPassword()
                    .type(password)
                    .then(() => {
                      registerConfirmPswd()
                        .type(password)
                        .then(() => {
                          registerButton().click();
                        });
                    });
                });
            });

          cy.waitForLatestEmail(inboxId).then((email) => {
            cy.log(inboxId);
            assert.isDefined(email);
            code = /([0-9]{6})$/.exec(email.body.split(".")[0])[1];
            assert.isDefined(code);
            confirmOTP()
              .type(code)
              .then(() => {
                confirmButton()
                  .click()
                  .then(() => {
                    cy.get('[data-cy = "modal.OK"]', { timeout: 10000 }).click();
                  });
              });
          });
        });

        visit("/").then(() => {
          cy.waitUntil(() => cy.window().then((win) => win.login.loading === false, { timeout: 10000, interval: 500 }));
          cy.window().should("have.property", "app");
          emailElement()
            .type(emailAddress)
            .then(() => {
              passwordElement()
                .type(password)
                .then(() => {
                  LoginButton()
                    .click()
                    .then(() => {
                      cy.location({ timeout: 10000 }).should((loc) => {
                        expect(loc.hash).to.eq("#/");
                      });
                    });
                });
            });
        });
      });
    });
  });
});
