
import {visit,validUser,invalidUser, login, get_app} from '../helper'

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
        //cy.wait(2000)
    })

    context('Quicktext check for LivChat', () => {
        it('Quickchat message send' ,() => {
            visit('/user/chats/8c6f4f37-8ba9-4afa-9618-e142280e8e05', {timeout: 50000}).then( () => {
                cy.waitUntil(() => cy.window().then(win => win.single.loading === false,{timeout:10000, interval: 100 }))
                cy.get('#typeMessage',{timeout: 1000} ).click().then( () => {
                    cy.get('#quicktextOption-1',{timeout: 1000}).click().then( () => {
                        cy.get('[data-cy="single.sendMessage"]',{timeout: 1000}).click()
                    })
                });
                cy.window().then(win => {
                    const component = win.single;
                    cy.log("this is chat name", component.chatName);
                    //cy.log("last chchatat message", component.messages.pop())
                    let length = component.messages.length;
                    cy.log(length);
                    cy.log("last chat message", component.messages[length-1].message);
                    cy.wrap(component.messages[length-1].message).should("eq","Nice World");
                })
            })

            // cy.get('[data-cy="single.sendMessage"]').click()
        })
    })

        // it('Quickchat message send' ,() => {
        //     visit('/user/chats/8c6f4f37-8ba9-4afa-9618-e142280e8e05', {timeout: 50000}).then( () => {
        //         cy.waitUntil(() => cy.window().then(win => win.single.loading === false,{timeout:10000, interval: 100 }))
        //         cy.get('#typeMessage',{timeout: 1000} ).click().then( () => {
        //             cy.get('#quicktextOption-1',{timeout: 1000}).click().then( () => {
        //                 cy.get('[data-cy="single.sendMessage"]',{timeout: 1000}).click()
        //             })
        //         });
        //         cy.window().then(win => {
        //             const component = win.single;
        //             cy.log("this is chat name", component.chatName);
        //             //cy.log("last chchatat message", component.messages.pop())
        //             let length = component.messages.length;
        //             cy.log(length);
        //             cy.log("last chat message", component.messages[length-1].message);
        //             cy.wrap(component.messages[length-1].message).should("eq","Nice World");
        //         })
        //     })

            // cy.get('[data-cy="single.sendMessage"]').click()
        //})

})