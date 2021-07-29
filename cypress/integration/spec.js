/// <reference types="cypress" />

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

it('completes second item', () => {
  cy.visit('/')
  // application starts with 3 todos
  cy.get('.todo')
    .should('have.length', 3)
    .eq(1)
    .contains('[data-cy=complete]', 'Complete')
    .wait(1000, { log: false }) // for better video
    .click()

  cy.get('.todo').eq(1).should('have.class', 'completed')
  // the other items are not completed
  cy.get('.todo').eq(0).should('not.have.class', 'completed')
  cy.get('.todo').eq(2).should('not.have.class', 'completed')
})
