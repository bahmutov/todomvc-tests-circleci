/// <reference types="cypress" />

function visitBlankPage() {
  cy.window().then((win) => {
    win.location.href = 'about:blank'
  })
}

beforeEach(() => {
  cy.window().then((win) => {
    win.location.href = 'about:blank'
  })
})

beforeEach(() => {
  cy.visit('/', {
    onBeforeLoad(win) {
      cy.spy(win.console, 'log').as('log')
    },
  })
  // the app has loaded
  cy.get('.todo').should('have.length', 3)
})

it('logs message on startup', () => {
  cy.get('@log').should('have.been.calledOnceWithExactly', 'rendering app')
})

it('logs message when adding a todo', () => {
  cy.get('@log').invoke('resetHistory') // reset the spy
  cy.get('[data-cy=new-todo]').type('hello{enter}')
  cy.get('@log').should('have.been.calledOnceWithExactly', 'added todo')
})
