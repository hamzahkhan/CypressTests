export const getChatId = () => {
  let chatId;
  //chatId = app.$store.getters["Common/threads"][0]
  debugger;
  cy.waitUntil(() => cy.window().then((win) => win.app.$store.getters["Common/threads"] !== null, { timeout: 10000, interval: 100 }));
  cy.window().then((w) => {
    cy.wrap(w.app.$store.getters["Common/threads"][0].group_id).as("chatId");
  });
};
