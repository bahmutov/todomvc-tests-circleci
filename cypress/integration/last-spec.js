/// <reference types="cypress" />

it('last test', { tags: '@sanity' }, () => {
  cy.visit('/')
  // application starts with 3 todos
  cy.get('.todo')
    .should('have.length', 3)
    .eq(1)
    .contains('[data-cy=complete]', 'Complete')
    .wait(2000, { log: false }) // for better video
    .click()

  cy.get('.todo').eq(1).should('have.class', 'completed')
  // the other items are not completed
  cy.get('.todo').eq(0).should('not.have.class', 'completed')
  cy.get('.todo').eq(2).should('not.have.class', 'completed')
})
