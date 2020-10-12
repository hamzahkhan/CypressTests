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

    context('account details form check', () => {
        it('Tests check' ,() => {
            visit('setup/manual',{timeout: 50000}).then(() => {
                cy.waitUntil(() => cy.window().then(win => win.setup.loading === false,{timeout:10000, interval: 100 }))
                // cy.window().then(win => {
                oldname = app.$store.state.User.user.name
                oldtitle = app.$store.state.User.user.title
                olddob = app.$store.state.User.user.dob
                cy.get('[data-cy="profile.Name"] > .md-input', {timeout:1000}).type(" test")
                cy.get('[data-cy = "profile.Title"]', {timeout:1000}).type(" test")
                cy.get('[data-cy = "profile.Save"]', {timeout:1000}).contains(' Save ').click()
                cy.waitUntil(() => cy.window().then(win => win.setup.loading === false,{timeout:10000, interval: 100 }))
                cy.get('button').contains('Ok').click()
            })

            visit('setup/manual',{timeout: 50000}).then(() => {

                cy.waitUntil(() => cy.window().then(win => win.setup.loading === false,{timeout:10000, interval: 100 }))
                cy.log(app.$store.state.User.user.name)
                cy.wrap(app.$store.state.User.user.name).should('be.eq', oldname + " test").then(() => {
                    cy.log('username change verified')
                })
                // TODO verify title changes and dob changes
                cy.wrap(app.$store.state.User.user.title).should('be.eq', oldtitle + " test").then(() => {
                    cy.log('username change verified')
                })  
                // cy.log(app.$store.state.User.user.title)
                // cy.log(app.$store.state.User.user.dob)

            })            
        })
    })

    // TODO add recovery process discuss and edit accordingly

    // context('account recovery details check', () => {
    //     it('details check' ,() => {
    //         visit('setup/manual',{timeout: 50000}).then(() => {
    //             cy.waitUntil(() => cy.window().then(win => win.setup.loading === false,{timeout:10000, interval: 100 }))
    //             cy.get('[data-cy="setup.recovery"]', {timeout:1000}).click().then(() => {
    //                 cy.get('[data-cy="recovery.questionOne"]', {timeout:1000}).should('')
                    
    //                 .click().type('test')
    //                 cy.get('[data-cy="recovery.questionTwo"]', {timeout:1000}).click().type('test')
    //                 cy.get('[data-cy="recovery.questionThree"]', {timeout:1000}).click().type('test')
    //             })          
    //         })
    //     })
    // })

})