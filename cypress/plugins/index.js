/// <reference types="cypress" />

const { setGitHubCommitStatus } = require('../../src')

// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

function getContext() {
  let context = 'Cypress tests'
  if (process.env.CIRCLE_NODE_INDEX && process.env.CIRCLE_NODE_TOTAL) {
    // index starts with 0
    const machineIndex = Number(process.env.CIRCLE_NODE_INDEX) + 1
    const totalMachines = Number(process.env.CIRCLE_NODE_TOTAL)
    context += ` (machine ${machineIndex}/${totalMachines})`
  }
  return context
}

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = async (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // include this plugin before cypress-grep
  // so if we find the test tags in the pull request body
  // we can grep for them by setting the grep config
  await require('grep-tests-from-pull-requests')(on, config, {
    // try to find checkbox lines in the pull request body with these tags
    tags: ['@log', '@sanity', '@user'],
    // repo with the pull request text to read
    owner: 'bahmutov',
    repo: 'todomvc-no-tests-vercel',
    // pass the pull request number in the above repo
    // we will grab the tests to run from the body of the pull request (if the number is known)
    pull: config.env.pullRequest,
    // if the pull request number is unknown, pass the commit SHA
    // as a fallback. The plugin will try to find the PR with this head commit
    commit: config.env.testCommit,
    // to get a private repo above, you might need a personal token
    token: process.env.PERSONAL_GH_TOKEN || process.env.GITHUB_TOKEN,
  })

  // https://github.com/bahmutov/cypress-grep
  require('cypress-grep/src/plugin')(config)

  // when we are done, post the status to GitHub
  // application repo, using the passed commit SHA
  // https://github.com/bahmutov/cypress-set-github-status
  require('cypress-set-github-status')(on, config, {
    owner: 'bahmutov',
    repo: 'todomvc-no-tests-vercel',
    commit: config.env.testCommit || process.env.TEST_COMMIT,
    token: process.env.GITHUB_TOKEN || process.env.PERSONAL_GH_TOKEN,
  })

  // cypress-grep could modify the config (the list of spec files)
  // thus it is important to return the modified config to Cypress
  return config
}
