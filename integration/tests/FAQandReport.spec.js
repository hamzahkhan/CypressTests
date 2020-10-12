import {visit,validUser,invalidUser} from '../helper'
describe('LivChat Tests', () => {
    let app
    let oldname, oldtitle, olddob
  
    before(() => {
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
            cy.waitUntil(() => app.$store.state.User.keys.pub !== null, {timeout:10000, interval: 500 } );  })
    })

    context('FAQ button check and report abuse option', () => {
        it('Tests check' ,() => {
            cy.waitUntil(() => cy.window().then(win => win.MainNavbar.loading === false,{timeout:10000, interval: 100 }))
            //cy.get('')
            cy.get('[data-cy = "mainNavbar.helpFAQ"]',{timeout:10000}).click({force:true})
            cy.get('[data-cy = "mainNavbar.helpFAQ"]',{timeout:10000}).click({force:true})
        })
    })
})

