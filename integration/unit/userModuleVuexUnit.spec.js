import { mutations } from '../../../src/store/modules/user/mutations'
import { getters } from '../../../src/store/modules/user/getters'
import {state as globalState} from '../../../src/store/modules/user/state'
describe('Unit tests', () => {
  context('User Mutations', () => {
    const { user, avatar, users, publicKey, privateKey } = mutations
    it('mutates state user object as expected', () => {
      cy.wrap(globalState).then(state => {
        user(state, { active: true })
        cy.wrap(state,{timeout: 5000}).its('user').should('have.property', 'active', true)
      })
    })
    it('mutates user avatar object as expected', () => {
      cy.wrap(globalState).then(state => {
        avatar(state, {image: '',user: '1fbd'})
        cy.wrap(state).its('avatars').should('deep.equal', {'1fbd': ''}, true)
      })
    })
    it('mutates users object as expected', () => {
      cy.wrap(globalState).then(state => {
        users(state, {items:[
            {active: true}
          ]})
        cy.wrap(state).its('users').should('deep.equal', {items:[
            {active: true}
          ]})
      })
    })
    it('mutates public key as expected', () => {
      cy.wrap(globalState).then(state => {
        publicKey(state, 'generatedPublicKey')
        cy.wrap(state).its('keys').its('pub').should('eq', 'generatedPublicKey', true)
      })
    })
    it('mutates private key as expected', () => {
      cy.wrap(globalState).then(state => {
        privateKey(state, 'generatedPrivateKey')
        cy.wrap(state).its('keys').its('pri').should('eq', 'generatedPrivateKey', true)
      })
    })
  })
  context('User Getters', ()=>{
    const {isAdmin, isPatient, isStaff, getAvatar, getCurrentUser, getFullUser, getUser, isAuthorized, isOnline, myAvatar, optInStatus, recoverySetupDone, userId, userName, userRole, users} = getters
    it('checks if a user is admin', () => {
      cy.wrap(globalState).then(state => {
        cy.wrap(isAdmin(state)).should('be.false')
        state.user.role = ['admin']
        cy.wrap(isAdmin(state)).should('be.true')
      })
    })
    it('checks if a user is staff', () => {
      cy.wrap(globalState).then(state => {
        cy.wrap(isStaff(state)).should('be.false')
        state.user.role = ['staff']
        cy.wrap(isStaff(state)).should('be.true')
      })
    })
    it('checks if a user is patient', () => {
      cy.wrap(globalState).then(state => {
        cy.wrap(isPatient(state)).should('be.false')
        state.user.role = ['patient']
        cy.wrap(isPatient(state)).should('be.true')
      })
    })
    it('fetches any users avatar', () => {
      cy.wrap(globalState).then(state => {
        cy.wrap(!!getAvatar(state)('userId')).should('be.false')
        state.avatars['userId'] = 'avatar'
        cy.wrap(!!getAvatar(state)('userId')).should('be.true')
      })
    })
    it('fetches current user avatar', () => {
      cy.wrap(globalState).then(state => {
        state.avatars['userId'] = 'avatar'
        state.user.user_id = 'userId'
        cy.wrap(myAvatar(state)).should('eq','avatar')
      })
    })
    it('returns current user', () => {
      cy.wrap(globalState).then(state => {
        state.user= {active: true, user_id: 'userId' }
        cy.wrap(getCurrentUser(state)).should('deep.equal',{active: true, user_id: 'userId' })
      })
    })
    it('Fetches other users', () => {
      cy.wrap(globalState).then(state => {
        state.users = {items:[
            {active: true, user_id: 'userId'}
          ]}
        cy.wrap(getFullUser(state,{isAdmin: true})('userId')).should('deep.equal',{active: true, user_id: 'userId' })
        state.users = [
            {active: true, user_id: 'userId'}
          ]
        cy.wrap(getFullUser(state,{isPatient: true})('userId')).should('deep.equal',{active: true, user_id: 'userId' })
      })
    })
    it('Returns user name', () => {
      cy.wrap(globalState).then(state => {
        state.users = {items:[
            {active: true, name: 'name', user_id: 'userId'}
          ]}
        cy.wrap(getUser(state,{isAdmin: true})('userId')).should('eq','name')
      })
    })
    it('checks if user is authorized', () => {
      cy.wrap(globalState).then(state => {
        state.keys.pub = null
        cy.wrap(isAuthorized(state)).should('be.false')
        state.user = {active: true, name: 'name', user_id: 'userId'}
        state.keys.pub = ''
        state.keys.pri = ''
        cy.wrap(isAuthorized(state)).should('be.true')
      })
    })
    it('checks if user is online', () => {
      cy.wrap(globalState).then(state => {
        state.keys.pub = null
        cy.wrap(isOnline(state,{getFullUser: function () {
          return {
            online: 0
          }
          }})({userId: 'userId'})).should('be.false')
        cy.wrap(isOnline(state,{getFullUser: function () {
            return {
              online: Date.now()
            }
          }})({userId: 'userId'})).should('be.true')
      })
    })
    it('fetches optInStatus', () => {
      cy.wrap(globalState).then(state => {
        cy.wrap(optInStatus(state)).should('be.true')
        state.user = {
          settings: {
            optInStatus: true
          }
        }
        cy.wrap(optInStatus(state)).should('be.false')
      })
    })
    it('fetches recovery status', () => {
      cy.wrap(globalState).then(state => {
        cy.wrap(recoverySetupDone(state)).should('be.false')
        state.user.private_key_qa = 'key'
        cy.wrap(recoverySetupDone(state)).should('be.true')
      })
    })
    it('fetches user Id', () => {
      cy.wrap(globalState).then(state => {
        state.user.user_id = 'userId'
        cy.wrap(userId(state)).should('eq', 'userId')
      })
    })
    it('fetches user Name', () => {
      cy.wrap(globalState).then(state => {
        state.user.name = 'name'
        cy.wrap(userName(state)).should('eq', 'name')
      })
    })
    it('fetches user Role', () => {
      cy.wrap(globalState).then(state => {
        state.user.role = ['patient']
        cy.wrap(userRole(state)).should('eq', 'patient')
      })
    })
    it('fetches all users', () => {
      cy.wrap(globalState).then(state => {
        state.users = {items:[
            {active: true, user_id: 'userId'}
          ]}
        cy.wrap(users(state,{isAdmin: true})).should('deep.equal', [{active: true, user_id: 'userId'}])
      })
    })
  })
})