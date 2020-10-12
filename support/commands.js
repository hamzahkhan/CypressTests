// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import 'cypress-file-upload';
import 'cypress-wait-until';

Cypress.Commands.add(
    'attach_file',
    {
      prevSubject: 'element',
    },
    (input, fileName, fileType) => {
      cy.fixture(fileName)
        .then(content => Cypress.Blob.base64StringToBlob(content, fileType))
        .then(blob => {
          const testFile = new File([blob], fileName)
          const dataTransfer = new DataTransfer()
  
          dataTransfer.items.add(testFile)
          input[0].files = dataTransfer.files
          return input
        })
    }
  )

  const { MailSlurp } = require('mailslurp-client');
  // set your api key with an environment variable CYPRESS_API_KEY
  // (cypress prefixes environment variables with CYPRESS)
  const apiKey = '2ed5482de985e60610c2f1dead00b6c8e915e3e5ac70018f4267ae22f8b035d5'
  const mailslurp = new MailSlurp({ apiKey });

  Cypress.Commands.add("createInbox", () => {
    return mailslurp.createInbox();
  });
  
  Cypress.Commands.add("waitForLatestEmail", (inboxId) => {
    return mailslurp.waitForLatestEmail(inboxId)
  });