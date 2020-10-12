import {visit,validUser,invalidUser} from '../helper'
describe('LivChat Tests', () => {
    let app
    let orgfontsize
    let increasefontsize
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
            // point of failure here - timeout:15000 - load page usually takes more, lot of inital loading fails here
            cy.waitUntil(() => app.$store.state.User.keys.pub !== null, {timeout:15000, interval: 500 } );
        })
    })

    context('Font size change', () => {
        it('Increase font size' ,() => {
            //cy.wait(2000)
            visit('/user/chats/8c6f4f37-8ba9-4afa-9618-e142280e8e05', {timeout: 50000})
            .then( () => {
                cy.waitUntil(() => cy.window().then(win => win.single !== null,{timeout:10000, interval: 100 }))
                cy.window().then( win => {
                    orgfontsize  = win.single.fontSize
                    cy.log("original font size", orgfontsize)
                })
                cy.get('[data-cy="single.increasefont"]',{timeout: 10000}).click({force:true})
                cy.window().then( win => { 
                    cy.log("new font size", win.single.fontSize)
                    cy.wrap(win.single.fontSize).should('be.gt',orgfontsize)
                    cy.log("increase font size works")
                })
                cy.window().then( win => { 
                    orgfontsize  = win.single.fontSize
                    cy.log("original font size", orgfontsize)
                })
                cy.get('[data-cy="single.decreasefont"]').click({force:true})
                cy.window().then( win => { 
                    cy.log("new font size", win.single.fontSize)
                    cy.wrap(orgfontsize).should('be.gt', win.single.fontSize)
                    cy.log("decrease font size works")
                })
            })
        })
    })
})
