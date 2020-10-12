import { visit, validUser, invalidUser, login, get_app, adminSettingsButton, chatOptionsButton, adminQuickTextModalAddButton } from "../helper";
import { isContext } from "vm";
const crypto = require("crypto");
const getStore = () => cy.window().its("app.$store");
let currentQuickTexts;
describe("LivChat Tests", () => {
  beforeEach(() => {
    login(Cypress.env("admin")["email"], Cypress.env("admin")["password"]);

    cy.waitUntil(() => cy.window().then((win) => Object.keys(win.app.$store.getters["Common/threads"]).length > 0), {
      timeout: 10000,
      interval: 100,
    });
  });

  context("Quicktext add check for LivChat", () => {
    it("adding new quicktext for specific role", () => {
      cy.get("@globalApp").then((app) => {
        cy.get('[data-cy="MainNavbar.Admin"]')
          .click()
          .then(() => {
            cy.waitUntil(() => cy.window().then((win) => !!win.administration), { timeout: 10000, interval: 100 });
            adminSettingsButton()
              .click()
              .then(() => {
                chatOptionsButton()
                  .click()
                  .then(() => {
                    const text = crypto.randomBytes(10).toString("hex");
                    if (!!app.$store.getters["Admin/getQuickTexts"]) {
                      currentQuickTexts = app.$store.getters["Admin/getQuickTexts"].length;
                    } else {
                      cy.wrap(0).as("currentQuickTexts");
                    }
                    cy.get('[data-cy="quicktext.addNew"]', { timeout: 10000 })
                      .click()
                      .then(() => {
                        cy.get("#filter")
                          .trigger("click", { force: true })
                          .then(() => {
                            cy.get("#selectRole-0", { timeout: 10000 })
                              .click({ force: true })
                              .then(() => {
                                cy.get("#typeMessage", { timeout: 10000 })
                                  .type(text)
                                  .then(() => {});
                              });
                            adminQuickTextModalAddButton()
                              .click({ force: true })
                              .then(() => {
                                cy.waitUntil(() => cy.window().then((win) => app.$store.getters["Admin/getQuickTexts"].length > currentQuickTexts), {
                                  timeout: 10000,
                                  interval: 100,
                                });
                              });
                          });
                      });
                  });
              });
          });
      });
    });
    // todo add delete quicktext functionality
  });
});
