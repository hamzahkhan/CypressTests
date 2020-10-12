import {visit,validUser,invalidUser} from '../helper'
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
            cy.waitUntil(() => app.$store.state.User.keys.pub !== null, {timeout:10000, interval: 500 } );
        })
        
    })

    context('Invite user to LivChat', () => {
        it('Tests check' ,() => {
            //cy.wait(1000)
            cy.get('[data-cy="MainNavbar.Invite"]',{timeout:10000}).click().then(() => {
                cy.get('.md-menu').get('#inviteOption-1').click({force:true}).then(() => {
                    cy.get('[data-cy = "inviteUser.next"]').click({force:true})
                })
                cy.get('.card-title').contains('Go Share').then(()=> {
                    cy.window().then(win => {
                        const component = win.MainNavbar.token;
                        cy.log("token" + component.token)
                        cy.wrap(win.MainNavbar.token.token).its('length').should('be.gte',1)
                    })
                })
            })
            cy.log("token is not null - invite user works")
        })
    })
})