
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
    })

    context('Quicktext add check for LivChat', () => {
        it("adding new quicktext for specific role", () => {
            visit('/administration',{timeout: 50000}).then( () => {
                cy.waitUntil(() => cy.window().then(win => win.administration.loading === false,{timeout:10000, interval: 100 }))
                cy.get("#tab-options", {timeout:10000}).click()
                //remove this hardcode cy.get
                cy.get(":nth-child(2) > .md-list-item-button > .md-list-item-content", {timeout:10000}).click()
                cy.get('[data-cy="quicktext.addNew"]', {timeout:10000}).click()
                cy.get("#filter").trigger('click', {force:true}).then( () => {
                    cy.get("#selectRole-0", {timeout:10000}).click({force:true})
                })
                    
                cy.get("#typeMessage", {timeout:10000}).type("Testing quicktext").then(()=> {
                    cy.get('button', {timeout:10000}).contains(" Add ").as('addTextBtn')
                    cy.get('@addTextBtn').click({ force: true })
                })
                cy.waitUntil(() => cy.window().then(win => win.administration.loading === false,{timeout:10000, interval: 100 }))
                

                // add verification test for above test from vuex
            })
        });
            
        // edit below test to replicate UI style not backend
            it("adding new quicktext for specific role", () => {
                visit('/administration',{timeout: 50000}).then( () => {
                    cy.waitUntil(() => cy.window().then(win => win.administration.loading === false,{timeout:10000, interval: 100 }))
                    cy.get("#tab-options", {timeout:10000}).click().then( () => {
                        cy.get(":nth-child(2) > .md-list-item-button > .md-list-item-content", {timeout:10000}).click().then( () => {
                            cy.waitUntil(() => app.$store.state.Admin.quickTexts.length !== 0,{timeout:10000, interval: 100 })
                            let length = app.$store.state.Admin.quickTexts.length
                            app.$store.state.Admin.quickTexts.pop()
                            cy.log(app.$store.state.Admin.quickTexts)
                            //cy.log(lastmsg)
                            cy.wrap(length).should('be.gt', app.$store.state.Admin.quickTexts.length)
                            //cy.log(app.$store.state.Admin.quickTexts[length-1].text)
                        })
                    })                   
                });

        })
    })




})

