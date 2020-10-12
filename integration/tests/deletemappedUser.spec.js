import {visit,validUser,invalidUser, login, get_app} from '../helper'
const crypto = require("crypto");

describe('LivChat Tests', () => {
    let app
    let userId = "15afbb3e-5363-4f67-a2a3-c644e350364d"
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

    context('Delete existing mapped users', () => {
        it('Delete mapped users' ,() => {
            let orgMapusers
            cy.visit('/administration',{timeout: 50000}).then(() => {
                cy.waitUntil(() => cy.window().then(win => win.administration.loading === false,{timeout:10000, interval: 100 }))
                cy.get('[mdicon="group"] > .md-ripple', {timeout:10000}).click().then(()=>{
                    cy.get('.md-toolbar-section-start > :nth-child(3) > .md-ripple', {timeout:10000}).click().then(()=> {
                        cy.get('.md-menu > [data-cy="search.usersearch"]', {timeout:10000}).click().focused().type("patienttest"+'{downarrow}{enter}',{force:true}).then( () => {
                            cy.get('[data-cy="admin.Next"] > .md-ripple > .md-button-content').click({force: true})
                        }).then( ()=> {
                            cy.get('[data-cy="admin.Title"]',{timeout: 10000}).contains("Map Patient").then(()=> {   
                                cy.waitUntil(() => cy.window().then(win => win.administration.loading === false,{timeout:10000, interval: 100 }))
                                cy.window().then(win => {
                                    const mapComponent = win.administration.mappedUsers;
                                    orgMapusers = win.administration.mappedUsers.length
                                    cy.log("mapped users before removing" + orgMapusers)
                                })                  
                                cy.get('.md-chip:last-child > .md-button',{timeout: 10000}).click().then(() => {
                                    cy.get('[data-cy="admin.save"] > .md-ripple > .md-button-content',{timeout: 10000}).click()
                                })
                                cy.window().then(win => {
                                    cy.log("mapped users after removing" + win.administration.mappedUsers.length)
                                    // checking if orginal mapped users is less than new mapped users
                                    cy.wrap(orgMapusers).should('be.gt', win.administration.mappedUsers.length)
                                })
                                cy.get('.modal-body').contains("Successfully Saved").then(() => {
                                    cy.get('button').contains('Ok').click()
                                })
                            })
                        })
                    })   
                })
            })
        })
    })
})
