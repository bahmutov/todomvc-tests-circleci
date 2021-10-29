/// <reference types="cypress" />

beforeEach(() => {
  // https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-navigate
  // how to find the frame ID?
  // cy.wrap(
  //   Cypress.automation('remote:debugger:protocol', {
  //     command: 'Page.navigate',
  //     params: {
  //       url: 'about:blank',
  //       frameId: '???',
  //     },
  //   }),
  // )

  // alternative
  cy.window().then((win) => {
    win.location.href = 'about:blank'
  })
})

it('works', () => {
  cy.visit('/')
  // application starts with 3 todos
  cy.get('.todo').should('have.length', 3)
  cy.get('[data-cy=new-todo]').type('Add tests!{enter}')
  cy.get('.todo')
    .should('have.length', 4)
    .eq(3)
    .should('include.text', 'Add tests!')

  cy.contains('.todo', 'Learn about React')
    .contains('[data-cy=complete]', 'Complete')
    .click()
  cy.contains('.todo', 'Learn about React').find('[data-cy=remove]').click()
  cy.get('.todo').should('have.length', 3)
  cy.contains('.todo', 'Learn about React').should('not.exist')

  cy.screenshot('finished', { capture: 'runner' })
})

it('has no visit logic', () => {
  cy.wrap(42).wait(1000).should('equal', 42)
})
