
import {visit,validUser,invalidUser, login, get_app} from '../helper'
const crypto = require("crypto");

describe('LivChat Tests', () => {
    let app
    beforeEach(() => {
        visit('/')
        cy.get('[data-cy="login.email"]').type('hamzahTest@grr.la')
        cy.get('[data-cy="login.password"]').type('asdQWE123!@')
        cy.get('[data-cy="login.loginButton"]').click()
        cy.location().should((loc) => {
            expect(loc.hash).to.eq('#/auth/login')
        })
        cy.window().should('have.property', 'app')
        cy.window().then(w => {
            app = w.app
            cy.log("First test run")
            cy.waitUntil(() => app.$store.state.User.keys.pub !== null, {timeout:15000, interval: 500 });
        })
    })

    context('QR Check invite', () => {
        it('qr check token if null' ,() => {
            cy.visit('http://localhost:8080/#/addContact', {timeout: 50000}).then(()=> {
                cy.waitUntil(() => cy.window().then(win => win.addUser.loading === false,{timeout:10000, interval: 100 }))
                cy.url().should('eq', Cypress.config().baseUrl + 'addContact').then( ()=> {
                    cy.window().then(win => {
                        cy.log(win.addUser.qrValue);
                        cy.wrap(win.addUser.qrValue).its('length').should('be.gte',1);
                    })
                }                    
                );
            })           
        })
    })
})
