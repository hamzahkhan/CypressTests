import { getters }              from '../../../src/store/modules/common/getters'
import { mutations }            from '../../../src/store/modules/common/mutations'
import { state as globalState } from '../../../src/store/modules/common/state'

describe('Unit tests', () => {
  context('Common Mutations', () => {
    const { addMessage, resetSidebar, quickTexts, currentThread, media, messages, oldMessages, sidebar, sidebarActive, subscribePointer, threads, updateAvailable, updateCounter, usersOfThreads } = mutations
    it('adds message to existing thread', () => {
      cy.wrap(globalState).then(state => {
        state.messages = {}
        addMessage(
          state, { message: { message_id: 'messageId' }, group: 'group' })
        cy.wrap(state).
          its('messages').
          its('group').
          should('deep.equal', [{ message_id: 'messageId' }])
      })
    })
    it('adds old message to an existing thread', () => {
      cy.wrap(globalState).then(state => {
        state.messages = {group: { items: [{ message_id: 'messageId' }]}}
        oldMessages(
          state, { messages: { items: [{ message_id: 'messageId1' }], nextToken: 'nextToken'}, group: 'group' })
        cy.wrap(state).
          its('messages').
          its('group').
          its('items').
          should('deep.equal', [{ message_id: 'messageId1' },{ message_id: 'messageId' }])
      })
    })
    it('resets sidebar to initial position', () => {
      cy.wrap(globalState).then(state => {
        resetSidebar(state)
        cy.wrap(state).its('sidebar').should('deep.equal', {
          type: null,
          active: false,
          payload: {},
        })
      })
    })
    it('mutates quick texts as expected', () => {
      cy.wrap(globalState).then(state => {
        quickTexts(state,{role: {}})
        cy.wrap(state).its('quickTexts').should('deep.equal', {role: {}})
      })
    })
    it('mutates currentThread as expected', () => {
      cy.wrap(globalState).then(state => {
        currentThread(state,'threadId')
        cy.wrap(state).its('currentThread').should('eq', 'threadId')
      })
    })
    it('mutates media object as expected', () => {
      cy.wrap(globalState).then(state => {
        media(state,{messageId: 'messageId', media: 'media'})
        cy.wrap(state).its('media').its('messageId').should('eq', 'media')
      })
    })
    it('mutates messages object as expected', () => {
      cy.wrap(globalState).then(state => {
        messages(state,{messages: [{message_id: 'messageId'}], group: 'group'})
        cy.wrap(state).its('messages').its('group').should('deep.equal', [{message_id: 'messageId'}])
      })
    })
    it('mutates sidebar object as expected', () => {
      cy.wrap(globalState).then(state => {
        sidebar(state,{active: true})
        cy.wrap(state).its('sidebar').should('deep.equal', {active: true})
      })
    })
    it('mutates sidebar active value as expected', () => {
      cy.wrap(globalState).then(state => {
        sidebarActive(state,false)
        cy.wrap(state).its('sidebar').its('active').should('be.false')
      })
    })
    it('mutates subscribe pointer as expected', () => {
      cy.wrap(globalState).then(state => {
        subscribePointer(state,{groupId:'groupId', pointer: 'pointer'})
        cy.wrap(state).its('subscribePointer').its('groupId').should('eq','pointer')
      })
    })
    it('mutates threads object as expected', () => {
      cy.wrap(globalState).then(state => {
        threads(state,[{id: 'id'}])
        cy.wrap(state).its('threads').should('deep.equal',[{id: 'id'}])
      })
    })
    it('mutates update Available value as expected', () => {
      cy.wrap(globalState).then(state => {
        updateAvailable(state,true)
        cy.wrap(state).its('updateAvailable').should('be.true')
      })
    })
    it('mutates thread Counter value as expected', () => {
      cy.wrap(globalState).then(state => {
        state.threads=[{group_id: 'groupId', unread: 0}]
        updateCounter(state, {group: {group_id: 'groupId'}})
        cy.wrap(state).its('threads').its(0).its('unread').should('eq', 1)
      })
    })
    it('mutates thread users as expected', () => {
      cy.wrap(globalState).then(state => {
        state.usersOfThreads=[{group_id: 'groupId', unread: 0}]
        usersOfThreads(state, {group: 'groupId', users: [{user_id: 0}, {user_id: 1}]})
        cy.wrap(state).its('usersOfThreads').its('groupId').should('deep.equal', [{user_id: 0}, {user_id: 1}])
      })
    })
  })
  context('User Getters', () => {
    const {getQuickTexts, currentMessages, currentThread, getMedia, getMessage, getSubscribePointer, getThread, sidebar, sidebarActive, stickers, threads, updateAvailable, userAvatars, usersOfThreads} = getters
    it('fetches quick texts', () => {
      cy.wrap(globalState).then(state => {
        state.quickTexts = [{ quickTexts: 'quick texts' }]
        cy.wrap(getQuickTexts(state)).
          should('deep.equal', [{ quickTexts: 'quick texts' }])
      })
    })
    it('fetches current thread messages', () => {
      cy.wrap(globalState).then(state => {
        state.currentThread = 'currentThread'
        state.messages = {currentThread: [{message_id: 1}]}
        cy.wrap(currentMessages(state)).
          should('deep.equal', [{message_id: 1}])
      })
    })
    it('fetches current thread', () => {
      cy.wrap(globalState).then(state => {
        state.currentThread = 'currentThread'
        cy.wrap(currentThread(state)).
          should('eq', 'currentThread')
      })
    })
    it('fetches any thread', () => {
      cy.wrap(globalState).then(state => {
        state.threads = [{group_id: 'threadId', message_id: 'id'}]
        cy.wrap(getThread(state)('threadId')).
          should('deep.equal', {group_id: 'threadId', message_id: 'id'})
      })
    })
    it('fetches media item', () => {
      cy.wrap(globalState).then(state => {
        state.media = {id: 'media'}
        cy.wrap(getMedia(state)('id')).
          should('eq', 'media')
      })
    })
    it('fetches message item', () => {
      cy.wrap(globalState).then(state => {
        state.currentThread = 'currentThread'
        state.messages = {currentThread: [{message_id: 'id'}]}
        cy.wrap(getMessage(state)('id')).
          should('deep.equal', {message_id: 'id'})
      })
    })
    it('fetches Subscribe pointer', () => {
      cy.wrap(globalState).then(state => {
        state.subscribePointer = {group: 'pointer'}
        state.messages = {currentThread: [{message_id: 'id'}]}
        cy.wrap(getSubscribePointer(state)('group')).
          should('eq', 'pointer')
      })
    })
    it('fetches sidebar object', () => {
      cy.wrap(globalState).then(state => {
        state.sidebar = {active: true, group: 'pointer'}
        cy.wrap(sidebar(state)).
          should('deep.equal', {active: true, group: 'pointer'})
      })
    })
    it('checks if sidebar active', () => {
      cy.wrap(globalState).then(state => {
        state.sidebar = {active: true, group: 'pointer'}
        cy.wrap(sidebarActive(state)).
          should('be.true')
      })
    })
    it('fetches stickers', () => {
      cy.wrap(globalState).then(state => {
        cy.wrap(stickers(state)).
          should('not.be.empty')
      })
    })
    it('fetches threads', () => {
      cy.wrap(globalState).then(state => {
        state.threads = [{group: 'group'}]
        cy.wrap(threads(state)).
          should('deep.equal',{'0': {group: 'group'}})
      })
    })
    it('fetches update available status', () => {
      cy.wrap(globalState).then(state => {
        state.updateAvailable = true
        cy.wrap(updateAvailable(state)).
          should('be.true')
      })
    })
    it('fetches user avatars', () => {
      cy.wrap(globalState).then(state => {
        state.userAvatars = [{avatar: 'avatar'}]
        cy.wrap(userAvatars(state)).
          should('deep.equal',[{avatar: 'avatar'}])
      })
    })
    it('fetches users Of Threads', () => {
      cy.wrap(globalState).then(state => {
        state.usersOfThreads=[{group_id: 'groupId', unread: 0}]
        cy.wrap(usersOfThreads(state)).should('deep.equal', [{group_id: 'groupId', unread: 0}])
      })
    })
  })
})