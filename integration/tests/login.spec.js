import {visit,validUser,invalidUser, emailElement} from '../helper'
describe('LivChat Tests', () => {

  let app
  beforeEach(() => {
    visit('/')
    cy.window().should('have.property', 'app')
    cy.window().then(w => {
      app = w.app
    })
  })
  context('Authorisation', () => {
    // update following for v1.1
    it('has no keys set when logged out', () => {
      cy.wrap(app.$store.state.User.keys.pub).should('equal',null)
      cy.wrap(app.$store.state.User.keys.pri).should('equal',null)
      cy.wrap(localStorage.getItem('unwrappedKey')).should('equal',null)
    })
    it('Loads login page if not authorised', () => {
      cy.location().should((loc)=>{
        expect(loc.hash).to.eq('#/auth/login')
      })
    })
    it('Redirects login page if not authorised', () => {
      visit('/dashboard')
      cy.location().should((loc)=>{
        expect(loc.hash).to.eq('#/auth/login')
      })
    })
  })
  context('Authentication', () => {
    it('Lets user login with right credentials and sets keys', () => {
      emailElement().type('hamzahTest@grr.la')
      cy.get('[data-cy="login.password"]').type('asdQWE123!@')
      cy.get('[data-cy="login.loginButton"]').click()
      cy.location().should((loc) => {
        expect(loc.hash).to.eq('#/')
      })
    })
  })

  // with very test run, we create a new user. Not the best way to do. A placeholder for future works maybe.
  // context('New user registration', () => {
  //   it('Lets you test user registration process', () => {
  //   })
  // })

})