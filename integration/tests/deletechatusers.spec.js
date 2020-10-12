import {visit,validUser,invalidUser} from '../helper'
describe('LivChat Tests', () => {
    let app
    let chatusers
    beforeEach(() => {
        visit('/')
        cy.get('[data-cy="login.email"]').type('himanshuoberoi75@gmail.com')
        cy.get('[data-cy="login.password"]').type('asdQWE123!@#')
        cy.get('[data-cy="login.loginButton"]').click()
        cy.location().should((loc) => {
            expect(loc.hash).to.eq('#/auth/login')
        })
        cy.window().should('have.property', 'app')
        cy.window().then(w => {
            app = w.app
            cy.log("First test run")
        })
        cy.wait(4000)
    })

    context('delete users from chats', () => {
        it('Tests check' ,() => {
            visit('/user/chats/8c6f4f37-8ba9-4afa-9618-e142280e8e05')
            cy.wait(2000)
            cy.window().then(win => {
                const component = win.single
                cy.log("this is chat name", component.chatName)
                cy.log("no of users in chat initally", component.currentUsers.length)
                chatusers = component.currentUsers.length
            })
            cy.get('[data-cy="single.removeUsers"]').click({force:true})
            // cy.get('.md-menu > [data-cy="search.usersearch"]').click().focused().type("hamza"+'{downarrow}{enter}',{force:true});
            // cy.get('[data-cy="single.adduserButton"]').click({force:true})
            // cy.wait(3000)
            //visit('/user/chats/8c6f4f37-8ba9-4afa-9618-e142280e8e05')
            cy.get('[data-cy="single.removebutton"]').click({force:true})
            cy.wait(500)
            cy.window().then(win => {
                //const component = win.single
                //const chatcomponent = win.single.currentUsers.pop();
                win.single.currentUsers.pop();
                //cy.log("this is chat name", component.chatName)
                cy.log("no of users in chat after adding", win.single.currentUsers.length)
                cy.wrap(chatusers).should('be.gt',win.single.currentUsers.length)

            })
        })
    })
})
