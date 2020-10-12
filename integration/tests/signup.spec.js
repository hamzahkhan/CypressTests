import { visit, validUser, invalidUser, emailElement } from "../helper";
describe("Sign up", () => {
  it("can load oauth demo site", () => {
    visit("/auth/register");
    cy.contains("Use the below form to register a new account.");
  });

  const password = "testPassword!2#";
  let inboxId;
  let emailAddress;
  const userName = "signup-tester2";
  let code;

  // comment out after one run
  it("can generate a new email address and sign up", () => {
    // see commands.js custom commands
    cy.createInbox().then((inbox) => {
      // verify a new inbox was created
      assert.isDefined(inbox);

      // save the inboxId for later checking the emails
      inboxId = inbox.id;
      emailAddress = inbox.emailAddress;

      // sign up with inbox email address and the password
      cy.get('[data-cy="register.name"]').type(userName);
      cy.get('[data-cy="register.email"]').type(emailAddress);
      cy.get('[data-cy="register.password"]').type(password);
      cy.get('[data-cy="register.confirmpassword"]').type(password);
    });
  });

  it("can receive the confirmation email and extract the code", () => {
    // wait for an email in the inbox
    cy.waitForLatestEmail(inboxId).then((email) => {
      // verify we received an email
      assert.isDefined(email);

      // verify that email contains the code
      assert.strictEqual(/verification code is/.test(email.body), true);

      // extract the confirmation code (so we can confirm the user)
      code = /([0-9]{6})$/.exec(email.body.split(".")[0])[1];
      //code = /([0-9]{6})$/.exec(email.body)[1];
      cy.log(code);

      assert.isDefined(code);
      cy.get('[data-cy="confirm.OTP"]').type(code);
      cy.get('[data-cy="confirm.confirmButton"]').click();
    });
  });

  it("can enter confirmation code and confirm user", () => {
    assert.isDefined(code);
    cy.get('[data-cy="confirm.OTP"]').type(code);
    cy.get('[data-cy="confirm.confirmButton"]').click();
  });

  it("can log in with confirmed account", () => {
    visit("/");
    cy.contains("Use the below form to login to your account.");
    // fill out username (email) and password
    emailElement().type(emailAddress);
    cy.get('[data-cy="login.password"]').type(password);
    cy.get('[data-cy="login.loginButton"]').click();
    cy.location().should((loc) => {
      expect(loc.hash).to.eq("#/");
    });
  });
});
