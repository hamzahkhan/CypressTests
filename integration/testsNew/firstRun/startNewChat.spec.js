import { visit, login, searchbox, testName, startChatButton, lastUserCSS, removeSave, startChatAside, removeUsers, addUsers } from "../../helper";
import { chownSync } from "fs";
const crypto = require("crypto");

/* 
1. Given usernames, emailid and password
2. Assumption - no mapped users and no threads for patient or staff
3. Deterministic one way testing - no if else or stupid conditions

*/

describe("LivChat Tests", () => {
  context("Messaging", () => {
    it("Create new chat with admin, patient and staff", () => {
      ///login("testUserPatient@grr.la", "asdQWE123!@");
      login(Cypress.env("admin")["email"], Cypress.env("admin")["password"]);

      cy.get("[data-cy='MainNavbar.Admin']", { timeout: 10000 })
        .click()
        .then(() => {
          cy.get("#tab-users", { timeout: 10000 })
            .click()
            .then(() => {
              cy.get(".md-toolbar-section-start > :nth-child(3) > .md-ripple", { timeout: 10000 })
                .click()
                .then(() => {
                  cy.window().then((win) => {
                    cy.waitUntil(() => cy.window().then((win) => win.administration.mapUsers === true), { timeout: 10000, interval: 500 });
                    cy.get('.md-menu > [data-cy="search.usersearch"]', { timeout: 10000 }, { force: true })
                      .click()
                      .focused()
                      .type(Cypress.env("patient")["name"], +"{downarrow}{enter}", { force: true })
                      .then(() => {
                        cy.get('[data-cy="admin.Next"]', { timeout: 10000 }, { force: true })
                          .click({ force: true })
                          .then(() => {
                            cy.waitUntil(() => cy.window().then((win) => win.administration.mapUsersStep === 2), { timeout: 10000, interval: 500 })
                              // cy.wrap(win.administration.mapUsersStep, { timeout: 10000, interval: 100 })
                              //   .should("be.eq", 2)
                              .then(() => {
                                let orgMapusers;
                                // assumption that no mapped user from before

                                cy.get('.md-menu > [data-cy="search.usersearch"]', { timeout: 10000 })
                                  .click()
                                  .focused()
                                  .type(Cypress.env("admin")["name"] + "{downarrow}{enter}", { force: true })
                                  .then(() => {
                                    cy.get('.md-menu > [data-cy="search.usersearch"]', { timeout: 10000 })
                                      .click()
                                      .focused()
                                      .type(Cypress.env("staff")["name"] + "{downarrow}{enter}", { force: true });
                                  })
                                  .then(() => {
                                    cy.get('[data-cy="admin.save"] > .md-ripple > .md-button-content', {
                                      timeout: 10000,
                                    }).click();
                                  })
                                  .then(() => {
                                    cy.window().then((win) => {
                                      cy.log("mapped users after adding" + win.administration.mappedUsers.length);
                                      // checking if orginal mapped users is less than new mapped users
                                      cy.wrap(win.administration.mappedUsers.length).should("be.eq", 2);
                                      // todo timeout 5 sec default global
                                    });
                                  });
                              });
                          });
                      });
                    //});
                  });
                });
            });
        });

      // assumptions - only 3 users in stack, 1 of each role
      // login with admin
      // pick users from user/users and add to chat
      // logout
    });

    it("Start chat with new recipient", () => {
      login(Cypress.env("patient")["email"], Cypress.env("patient")["password"]);
      cy.get("@globalApp").then((app) => {
        startChatAside()
          .click()
          .then(() => {
            cy.waitUntil(() => cy.window().then((win) => win.StartChat.loading === false, { timeout: 10000, interval: 100 }));
            cy.window().then((win) => {
              cy.wait(1500).then(() => {
                cy.get(".md-menu")
                  .find('[data-cy="search.usersearch"]', { timeout: 10000 })
                  .click()
                  .focused()
                  .type(Cypress.env("admin")["name"] + "{downarrow}{enter}", { force: true })
                  .then(() => {
                    cy.get(".md-menu")
                      .find('[data-cy="search.usersearch"]', { timeout: 10000 })
                      .click()
                      .focused()
                      .type(Cypress.env("staff")["name"] + "{downarrow}{enter}", { force: true });
                  })

                  .then(() => {
                    testName()
                      .type(Cypress.env("chatname"), { force: true })
                      .then(() => {
                        startChatButton()
                          .click({ force: true })
                          .then(() => {
                            cy.waitUntil(() => cy.window().then((win) => !!win.single), { timeout: 10000, interval: 100 });

                            cy.waitUntil(() => cy.window().then((win) => !!win.single.currentUsers), { timeout: 10000, interval: 100 }).then(() => {
                              cy.get('[data-cy="single.removeUsers"]', { timeout: 10000, interval: 100 })
                                .click({ force: true })
                                .then(() => {
                                  cy.window().then(() => {
                                    lastUserCSS()
                                      .click()
                                      .then(() => {
                                        removeSave().click();
                                      });
                                  });
                                });

                              cy.waitUntil(() => cy.window().then((win) => win.single.currentUsers.length <= 2, { timeout: 20000, interval: 100 }));

                              cy.waitUntil(() => cy.window().then((win) => win.single.loading === false, { timeout: 20000, interval: 100 }));

                              addUsers()
                                .click({ force: true })
                                .then(() => {
                                  cy.wait(1500).then(() => {
                                    searchbox(Cypress.env("staff")["name"]).then(() => {
                                      cy.get('[data-cy="single.adduserButton"]')
                                        .click()
                                        .then(() => {
                                          cy.waitUntil(() => cy.window().then((win) => win.single.currentUsers.length >= 1), {
                                            timeout: 10000,
                                            interval: 500,
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
            });
          });
      });
    });

    it.skip("Remove mapped users from admin account", () => {
      login(TestingUserData["admin"]["email"], TestingUserData["admin"]["password"]);
      cy.get("[data-cy='MainNavbar.Admin']", { timeout: 10000 })
        .click()
        .then(() => {
          cy.get("#tab-users", { timeout: 10000 })
            .click()
            .then(() => {
              cy.get('[mdicon="group"] > .md-ripple', { timeout: 10000 })
                .click()
                .then(() => {
                  cy.get(".md-toolbar-section-start > :nth-child(3) > .md-ripple", { timeout: 10000 })
                    .click()
                    .then(() => {
                      cy.get('.md-menu > [data-cy="search.usersearch"]', { timeout: 10000 })
                        .click()
                        .focused()
                        .type(TestingUserData["patient"]["name"] + "{downarrow}{enter}", { force: true })
                        .then(() => {
                          cy.get('[data-cy="admin.Next"] > .md-ripple > .md-button-content').click({ force: true });
                        })
                        .then(() => {
                          cy.waitUntil(() => cy.window().then((win) => win.administration.loading === false, { timeout: 10000, interval: 100 }));

                          cy.get(".md-chip:last-child > .md-button", { timeout: 10000 })
                            .click()
                            .then(() => {
                              cy.get(".md-chip > .md-button", { timeout: 10000 })
                                .click()
                                .then(() => {
                                  cy.get('[data-cy="admin.save"] > .md-ripple > .md-button-content', { timeout: 10000 }).click();
                                });
                            });

                          cy.get(".modal-body")
                            .contains("Successfully Saved")
                            .then(() => {
                              cy.get("button")
                                .contains("Ok")
                                .click();
                            });
                        });
                    });
                });
            });
        });
    });
  });
});
