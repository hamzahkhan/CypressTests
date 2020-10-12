import { visit, validUser, invalidUser, login } from "../helper";
describe("LivChat Tests", () => {
  let app;
  let oldname, oldtitle, olddob;
  let mappedUserid;
  beforeEach(() => {
    login(Cypress.env("admin")["email"], Cypress.env("admin")["password"]);

    cy.waitUntil(() => cy.window().then((win) => Object.keys(win.app.$store.getters["Common/threads"]).length > 0), {
      timeout: 10000,
      interval: 100,
    });
  });

  context("Add and delete mapped users", () => {
    it("Tests check", () => {
      cy.get("@globalApp").then((app) => {
        //cy.wait(2000);
        // cy.waitUntil(() => Object.keys(app.$store.state.Common.threads).length !== 0, { timeout: 10000, interval: 500 });

        cy.waitUntil(
          () =>
            cy.window().then((win) => Object.keys(app.$store.getters["Common/threads"]).length > 0 && Object.keys(app.$store.getters["User/users"]).length > 0),
          {
            timeout: 10000,
            interval: 100,
          }
        );
        cy.wrap(app.$store.getters["User/users"].filter((en) => en.role !== null).filter((en) => en.role[0] === "patient")).as("patientUsers");

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
                      cy.get("@patientUsers").then((patientUsers) => {
                        debugger;
                        cy.get('.md-menu > [data-cy="search.usersearch"]', { timeout: 10000 })
                          .click()
                          .focused()
                          .type(patientUsers[0].name + "{downarrow}{enter}", { force: true })
                          .then(() => {
                            cy.get('[data-cy="admin.Next"]', { timeout: 10000 })
                              .click({ force: true })
                              .then(() => {
                                cy.wrap(win.administration.mapUsersStep, { timeout: 10000, interval: 100 })
                                  .should("be.eq", 2)
                                  .then(() => {
                                    debugger;
                                    cy.waitUntil(() => cy.window().then((win) => Object.keys(win.administration.mappedUsers).length > 0), {
                                      timeout: 10000,
                                      interval: 500,
                                    }).then(() => {
                                      mappedUserid = win.administration.mappedUsers.slice(-1)[0].Id;
                                      let userIdName;
                                      cy.get(".md-chip:last-child > .md-button", { timeout: 10000 }).click();

                                      Object.values(app.$store.getters["User/users"]).forEach((en) => {
                                        if (en.user_id !== mappedUserid) {
                                          userIdName = en.name;
                                        }
                                      });

                                      cy.get('.md-menu > [data-cy="search.usersearch"]', { timeout: 10000 })
                                        .click()
                                        .focused()
                                        .type(userIdName + "{downarrow}{enter}", { force: true })
                                        .then(() => {
                                          cy.get('[data-cy="admin.save"] > .md-ripple > .md-button-content', {
                                            timeout: 10000,
                                          }).click();
                                        });
                                    });
                                    // todo - add verification if mappedUsers length increases or decreases
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
