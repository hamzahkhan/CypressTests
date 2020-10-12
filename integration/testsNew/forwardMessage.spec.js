import { visit, validUser, invalidUser, login, get_app, adminSettingsButton, chatOptionsButton, adminQuickTextModalAddButton } from "../helper";
import { isContext } from "vm";
const crypto = require("crypto");
const getStore = () => cy.window().its("app.$store");

describe("LivChat Tests", () => {
  beforeEach(() => {
    login();
    cy.waitUntil(() => cy.window().then((win) => Object.keys(win.app.$store.getters["Common/threads"]).length > 0), {
      timeout: 10000,
      interval: 100,
    });
  });

  it("Forward message", () => {
    cy.get("@globalApp").then((app) => {});
  });
});
