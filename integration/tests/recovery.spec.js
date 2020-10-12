import { visit, validUser, invalidUser } from "../helper";
const crypto = require("crypto");
describe("LivChat Tests", () => {
  let app;
  let oldname, oldtitle, olddob;
  let chatid, message;
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
      cy.wrap(w.app).as("globalApp");
      app = w.app;
      cy.log("First test run");
      //   cy.waitUntil(() => w.app.$store.state.User.keys.pub !== null, {
      //     timeout: 10000,
      //     interval: 500,
      //   });
      cy.waitUntil(() => app.$store.state.User.keys.pub !== null, { timeout: 10000, interval: 500 });
    });
  });

  context("Recovery user profile", () => {
    it("Tests check", () => {
      //weird
      cy.wait(2000);
      cy.window().then((win) => {
        if (app.$store.getters["User/recoverySetupDone"]) {
          // check if chats exist - if not create one
          if (Object.keys(app.$store.getters["Common/threads"]).length > 0) {
            // get thread id first
            chatid = app.$store.getters["Common/threads"][0].group_id;
            cy.visit("/user/chats/" + chatid, { timeout: 50000 }).then(() => {
              cy.waitUntil(() =>
                cy.window().then((win) => win.single.loading === false, { timeout: 10000, interval: 100 })
              );
              message = crypto.randomBytes(10).toString("hex");
              cy.get("#typeMessage")
                .click()
                .type(message)
                .then(() => {
                  cy.get('[data-cy="single.sendMessage"]').click(); // do I need to wait to check updated message details in vuex after sending
                });
              cy.get("[data-cy='MainNavbar.Logout']").click();
            });
          });
        })
          
            debugger;
            // how to confirm if user has logout ?

            cy.window().then(win => {
              cy.waitUntil(() => app.$store.state.User.keys.pub === null, { timeout: 10000, interval: 500 });

            // recovery process start
            let email = "HamzahNe@grr.la";
            cy.get('[href="#/auth/forgot"] > .md-ripple > .md-button-content')
              .click()
              .then(() => {
                cy.get('[data-cy="forgot.email"]')
                  .type(email)
                  .then(() => {
                    cy.get('[data-cy="forgot.startRecovery"]').click();
                  });
              });

            })
            
            //
            // via UI method
            // if (Object.keys(win.list.threads).length > 0) {
            //   // get thread id first
            //   chatid = win.list.threads[0].group_id;
            //   visit("/" + chatid, { timeout: 50000 }).then(() => {
            //     cy.log(" runadning");
            //   });

            // visit thread id URL

            // send new message
            //}
        
        
        // via state method
      
    });
  });
});
