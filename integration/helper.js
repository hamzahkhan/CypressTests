export const validUser = () => {
  return { email: "himanshuoberoi75@gmail.com", password: "" };
};
export const invalidUser = () => {
  return { email: "himanshuoberoi75@gmail.com", password: "password" };
};
export const visit = (url) => cy.visit(url, { timeout: 80000 });
export const emailElement = () => cy.get('[data-cy="login.email"]');
export const passwordElement = () => cy.get('[data-cy="login.password"]');
//export const username = "hamzahPatient";
export const searchbox = (userName) =>
  cy
    .get(".md-menu")
    .find('[data-cy="search.usersearch"]', { timeout: 10000 })
    .click()
    .focused()
    .type(userName + "{downarrow}{enter}", { force: true });

export const testName = () => cy.get('[data-cy="startChat.testName"]', { timeout: 10000 });
export const sendMessage = () => cy.get('[data-cy="single.sendMessage"]', { timeout: 10000 });
export const startChatAside = () => cy.get('[data-cy="startChat.button"]', { timeout: 10000 });
export const startChatButton = () => cy.get('[data-cy="startChat.chatButton"]', { timeout: 10000 });

export const removeUsers = () => cy.get('[data-cy="single.removeUsers"]', { timeout: 10000 });
export const removeSave = () => cy.get('[data-cy="single.removebutton"]', { timeout: 10000 });
export const addUsers = () => cy.get('[data-cy="single.addUsers"]', { timeout: 10000 });
export const EmojiSelect = () => cy.get('[data-cy="single.Emoji"]', { timeout: 10000 });
export const stickerSelect = () => cy.get('[data-cy="single.Sticker"]', { timeout: 10000 });
export const increaseFont = () => cy.get('[data-cy="single.increasefont"]', { timeout: 10000 });
export const decreaseFont = () => cy.get('[data-cy="single.decreasefont"]', { timeout: 10000 });
export const InviteTab = () => cy.get('[data-cy="MainNavbar.Invite"]', { timeout: 10000 });
export const InviteUserNext = () => cy.get('[data-cy = "inviteUser.next"]', { timeout: 10000 });
export const LoginButton = () => cy.get('[data-cy="login.loginButton"]');

export const registerName = () => cy.get('[data-cy="register.name"]', { timeout: 10000 });
export const registerEmail = () => cy.get('[data-cy="register.email"]');
export const registerPassword = () => cy.get('[data-cy="register.password"]');
export const registerConfirmPswd = () => cy.get('[data-cy="register.confirmpassword"]');
export const registerButton = () => cy.get('[data-cy = "register.Submitbutton"]');
export const confirmOTP = () => cy.get('[data-cy="confirm.OTP"]', { timeout: 10000 });
export const confirmButton = () => cy.get('[data-cy="confirm.confirmButton"]');

export const adminSettingsButton = () => cy.get('[data-cy="admin.settingsButton"] [mdicon="settings"] > .md-ripple');
export const chatOptionsButton = () => cy.get('[data-cy="admin.settingsButton"] :nth-child(2) > .md-list-item-button > .md-list-item-content');
export const adminQuickTextModalAddButton = () => cy.get('[data-cy="admin.quicktext.add"] .md-ripple');

export const stickerCSS = () => cy.get(":nth-child(4) > .sticker", { timeout: 10000 });
export const emoticonCSS = () => cy.get(".grid-emojis > :nth-child(2)", { timeout: 10000 });
export const lastUserCSS = () => cy.get(".md-chip:last-child > .md-button", { timeout: 10000 });
export const chatOptionsCSS = () => cy.get(":nth-child(2) > .md-list-item-button > .md-list-item-content", { timeout: 10000 });

export const recoveryOTP = () => cy.get('[data-cy="forgot.OTP"]', { timeout: 10000 });
export const recoveryPswd = () => cy.get('[data-cy="forgot.newPassword"]', { timeout: 10000 });
export const recoveryPswdRepeat = () => cy.get('[data-cy="forgot.newPasswordRepeat"]', { timeout: 10000 });

export const get_app = () => {
  let app;
  visit("/");
  cy.window().then((w) => {
    app = w.app;
    cy.log(app);
    return app;
  });
};
// role to
export const login = (email, password) => {
  let app;
  visit("/");
  emailElement()
    .type(email)
    .then(() => {
      cy.get('[data-cy="login.password"]')
        .type(password)
        .then(() => {
          cy.get('[data-cy="login.loginButton"]').click();
        });
    });
  cy.window().should("have.property", "app");
  cy.window().then((w) => {
    cy.wrap(w.app).as("globalApp");
    cy.waitUntil(() => w.app.$store.state.User.keys.pub !== null, { timeout: 10000, interval: 500 });
  });
};

export const UserData = {
  email: "HamzahNe@grr.la hamzahTest@grr.la  hamzahStaff@grr.la",
  password: "QwErT!2#  asdQWE123!@  asdQWE123!@",
  answer1: "dog",
  answer2: "Allahabad",
  answer3: "faizy",
};
