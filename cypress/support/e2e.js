/// <reference types="cypress" />

// load and register the grep feature
// https://github.com/bahmutov/cypress-grep
require('cypress-grep')()

function visitBlankPage() {
  cy.window().then((win) => {
    win.location.href = 'about:blank'
  })
}

// read https://glebbahmutov.com/blog/visit-blank-page-between-tests/
beforeEach(visitBlankPage)
