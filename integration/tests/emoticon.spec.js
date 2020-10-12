import {visit,validUser,invalidUser} from '../helper'
describe('LivChat Tests', () => {
    let app
    let chatusers
    beforeEach(() => {
        visit('/')
        cy.get('[data-cy="login.email"]',{timeout: 10000}).type('hamzahTest@grr.la')
        cy.get('[data-cy="login.password"]',{timeout: 10000}).type('asdQWE123!@')
        cy.get('[data-cy="login.loginButton"]',{timeout: 10000}).click()
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

    context('emoticon and reactions check LivChat', () => {
        it('emoticon testing on Livchat', () => {
        cy.visit('http://localhost:8080/#/user/chats/da495d6b-bee1-4ec1-8fb2-62f3bfc3608b',{timeout: 50000}).then(() => {
                //alter wait until to something more concrete than != NULL
                cy.waitUntil(() => cy.window().then(win => win.single.loading === false,{timeout:10000, interval: 100 }))
                cy.window().then(win => {
                    app = win.app
                    const groupid = win.single.userGroup.group_id
                    let numMessages = app.$store.state.Common.messages[groupid].length
                    cy.log(numMessages)
                })
                cy.get('[data-cy="single.Emoji"]',{timeout: 10000}).click({force:true }).then(() => {
                    cy.get('.grid-emojis > :nth-child(2)',{timeout: 10000}).click({force:true }).then(()=> {
                        cy.get('[data-cy="single.sendMessage"] > .md-ripple',{timeout: 10000}).click().then(()=> {
                            cy.window().then(win => {
                                app = win.app
                                const groupid = win.single.userGroup.group_id
                                let length = app.$store.state.Common.messages[groupid].length
                                cy.log(length);
                                cy.log("last chat message", app.$store.state.Common.messages[groupid][length-1].message)
                                
                                // to verify this message is emoticon type TODO
                                let messageType = app.$store.state.Common.messages[groupid][length-1].meta
                                cy.log(messageType)
                            })
                        })
                    })
                })
            })
    });

    it('sticker testing on Livchat', () => {
        cy.visit('http://localhost:8080/#/user/chats/da495d6b-bee1-4ec1-8fb2-62f3bfc3608b',{     
            timeout: 50000}).then( () => {
                cy.waitUntil(() => cy.window().then(win => win.single.loading === false,{timeout:10000, interval: 100 }))
                cy.get('[data-cy="single.Sticker"]',{timeout: 10000}).click({force:true })
                cy.get(':nth-child(4) > .sticker',{timeout: 10000}).click({force:true })
                cy.get('[data-cy="single.sendMessage"]',{timeout: 10000}).click({force:true })
                cy.window().then(win => {
                    app = win.app
                    const groupid = win.single.userGroup.group_id
                    let length = app.$store.state.Common.messages[groupid].length
                    cy.log(length);
                    cy.log("last chat message", app.$store.state.Common.messages[groupid][length-1].message)
                    
                    //TODO to verify this message is sticker type
                    let messageType = app.$store.state.Common.messages[groupid][length-1].meta
                    cy.log(messageType)
                })
            })
        })           
    })
})
