import { visit, validUser, invalidUser } from "../helper";
describe("LivChat Tests", () => {
  let app;
  let chatusers;
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
      cy.log("First test run");
      cy.waitUntil(() => app.$store.state.User.keys.pub !== null, { timeout: 10000, interval: 500 });
    });
  });

  context("Add users to chats", () => {
    it("Tests check", () => {
      cy.visit("http://localhost:8080/#/user/chats/da495d6b-bee1-4ec1-8fb2-62f3bfc3608b", { timeout: 50000 }).then(() => {
        cy.waitUntil(() => cy.window().then((win) => win.single.loading === false, { timeout: 10000, interval: 100 }));
        cy.window().then((win) => {
          const component = win.single;
          cy.log("this is chat name", component.chatName);
          cy.log("no of users in chat initally", win.single.currentUsers.length);
          chatusers = win.single.currentUsers.length;
        });
        cy.get('[data-cy="single.addUsers"]', { timeout: 10000 }).click({ force: true });
        cy.get('.md-menu > [data-cy="search.usersearch"]', { timeout: 10000 })
          .click({ force: true })
          .type("patienttes" + "{downarrow}{enter}", { force: true });
        cy.get('[data-cy="single.adduserButton"]', { timeout: 10000 }).click({ force: true });

        cy.log(app.$store.getters["Common/usersOfThreads"]);
        cy.log(app.$store.getters["Common/usersOfThreads"].length);

        cy.waitUntil(() => cy.window().then((win) => win.single.currentUsers.length > chatusers, { timeout: 10000, interval: 100 }));

        // test via avatar loaded on topbar
        // // write logic to get avatar on navbar and then go ahead
        cy.window().then((win) => {
          const component = win.single;
          cy.log("this is chat name", component.chatName);
          cy.log("no of users in chat after adding", component.currentUsers.length);
          cy.wrap(component.currentUsers.length).should("be.gt", chatusers);
        });
      });
    });
  });
});

import { visit, validUser, invalidUser, login } from "../helper";
describe("LivChat Tests", () => {
  let app;
  let oldname, oldtitle, olddob;

  beforeEach(() => {
    login();
  });

  // to keep logic UI driven, use state getters only

  context("Add users to chats", () => {
    it("Tests check", () => {
      // cy.waitUntil(() => cy.window().then(win => win.list.loading === false,{timeout:10000, interval: 100 }))
      cy.get("@globalApp").then((app) => {
        cy.log(app.$store.state);
        //cy.log(Object.keys(app.$store.state.Common.threads));
        //cy.waitUntil(() => app.$store.state.Common.threads !== [], { timeout: 10000, interval: 500 }); // improve checking condition for waitUntil
        //cy.wait(10000);
        let va = app.$store.state.Common;
        cy.log(va);
        Object.values(va).forEach((en) => {
          cy.log(en);
        });
        //app = w.app;
        //debugger;
        if (app.$store.state.Common.threads.length) {
          cy.log("works -" + app.$store.state.Common.threads.length);
        } else {
          cy.log(app.$store.state.Common.threads);
          cy.log("works"); //app.$store.state.Common.usersOfThreads)
        }
      });

      //if threads lentgth greater than 0
      cy.window().then((win) => {
        app = win.app;
        let chats = app.$store.state.Common.threads.length;
        //app.$store.getters.Common.threads.length;
        //cy.log(app.$store.getters.Common.threads);
        cy.log(app.$store.state.Common.threads.length);

        // cy.wrap(chats)
        //   .should("be.gt", 1)
        //   .then(() => {
        //     cy.log("more than 1 chats");
        //   });
      });

      //=> Check if any chat exists ( State.common.threads )

      // =>if exists
      //     find out any chat with at least two users in it ( State.Common.usersOfThreads)
      //     remove the last user from chat and save its id in a variable or alias.
      //     add the same user back

      // => if Does not exists
      //     Create a new chat ( start chat with a user )
      //     remove the user you started chat with
    });
  });
});
