import { mutations } from '../../../src/store/modules/admin/mutations'
import { getters } from '../../../src/store/modules/admin/getters'
import {state as globalState} from '../../../src/store/modules/admin/state'
describe('Unit tests', () => {
  context('Admin Mutations', () => {
    const {quickTexts,stats} = mutations
    it('mutates quick texts as expected', () => {
      cy.wrap(globalState).then(state => {
        quickTexts(state, [{quickTexts: 'quick texts'}])
        cy.wrap(state).its('quickTexts').should('deep.equal', [{quickTexts: 'quick texts'}])
      })
    })
    it('mutates stats as expected', () => {
      cy.wrap(globalState).then(state => {
        stats(state, {roles: {}})
        cy.wrap(state).its('stats').should('deep.equal', {roles: {}})
      })
    })
  })
  context('User Getters', ()=>{
    const {getQuickTexts, getStats} = getters
    it('fetches quick texts', () => {
      cy.wrap(globalState).then(state => {
        state.quickTexts = [{quickTexts: 'quick texts'}]
        cy.wrap(getQuickTexts(state)).should('deep.equal',[{quickTexts: 'quick texts'}])
      })
    })
    it('fetches stats', () => {
      cy.wrap(globalState).then(state => {
        state.stats = [{stats: 'stats'}]
        cy.wrap(getStats(state)).should('deep.equal',[{stats: 'stats'}])
      })
    })
    
  })
})