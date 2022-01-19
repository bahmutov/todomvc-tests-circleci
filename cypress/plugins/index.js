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

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // https://github.com/bahmutov/cypress-grep
  require('cypress-grep/src/plugin')(config)

  const testCommit = config.env.testCommit || process.env.TEST_COMMIT
  if (testCommit) {
    const owner = 'bahmutov'
    const repo = 'todomvc-no-tests-vercel'
    console.log('after finishing the test run will report the results')
    console.log('as a status check %s/%s commit %s', owner, repo, testCommit)

    on('after:run', async (runResults) => {
      // console.dir(runResults, { depth: null })

      // put the target repo information into the options
      let context = 'Cypress tests'
      if (process.env.CIRCLE_NODE_INDEX && process.env.CIRCLE_NODE_TOTAL) {
        // index starts with 0
        const machineIndex = Number(process.env.CIRCLE_NODE_INDEX) + 1
        const totalMachines = Number(process.env.CIRCLE_NODE_TOTAL)
        context += ` (machine ${machineIndex}/${totalMachines})`
      }

      const options = {
        owner,
        repo,
        commit: testCommit,
        status: runResults.totalFailed > 0 ? 'failure' : 'success',
        description: `${runResults.totalTests} tests finished`,
        context,
        targetUrl: runResults.runUrl || process.env.CIRCLE_BUILD_URL,
      }
      const envOptions = {
        token: process.env.GITHUB_TOKEN,
      }
      await setGitHubCommitStatus(options, envOptions)
    })
  }

  // cypress-grep could modify the config (the list of spec files)
  // thus it is important to return the modified config to Cypress
  return config
}
