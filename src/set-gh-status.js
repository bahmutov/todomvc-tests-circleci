const got = require('got')
const debug = require('debug')('set-gh-status')
const arg = require('arg')

const args = arg({
  '--owner': String,
  '--repo': String,
  '--commit': String,

  // commit status fields
  // https://docs.github.com/en/rest/reference/commits#commit-statuses
  '--status': String,
  '--description': String,
  '--target-url': String,
  '--context': String,

  // aliases
  '-o': '--owner',
  '-r': '--repo',
  '-c': '--commit',
  '--sha': '--commit',
  '-s': '--status',
})
debug('args: %o', args)

const validStatuses = ['pending', 'success', 'failure', 'error']

async function setGitHubCommitStatus(options, envOptions) {
  debug('setting commit status: %o', options)

  if (!options.owner) {
    console.error('--owner is required')
    process.exit(1)
  }
  if (!options.repo) {
    console.error('--repo is required')
    process.exit(1)
  }
  if (!validStatuses.includes(options.status)) {
    console.error(
      '--status was invalid "%s" must be one of: %o',
      options.status,
      validStatuses,
    )
    process.exit(1)
  }

  // REST call to GitHub API
  // https://docs.github.com/en/rest/reference/commits#commit-statuses
  // https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token#example-calling-the-rest-api
  // a typical request would be like:
  // curl --request POST \
  // --url https://api.github.com/repos/${{ github.repository }}/statuses/${{ github.sha }} \
  // --header 'authorization: Bearer ${{ secrets.GITHUB_TOKEN }}' \
  // --header 'content-type: application/json' \
  // --data '{
  //     "state": "success",
  //     "description": "REST commit status",
  //     "context": "a test"
  //   }'
  const url = `https://api.github.com/repos/${options.owner}/${options.repo}/statuses/${options.commit}`
  debug('url: %s', url)

  // @ts-ignore
  const res = await got.post(url, {
    headers: {
      authorization: `Bearer ${envOptions.token}`,
    },
    json: {
      context: options.context,
      state: options.status,
      description: options.description,
      target_url: options.targetUrl,
    },
  })
  console.log('response status: %d %s', res.statusCode, res.statusMessage)
}

function checkEnvVariables(env) {
  if (!env.GITHUB_TOKEN) {
    console.error('Cannot find environment variable GITHUB_TOKEN')
    process.exit(1)
  }
}

checkEnvVariables(process.env)

const options = {
  owner: args['--owner'],
  repo: args['--repo'],
  commit: args['--commit'],
  // status fields
  status: args['--status'],
  description: args['--description'] || 'Tests finished',
  targetUrl: args['--target-url'],
  context: args['--context'] || 'Cypress tests',
}
const envOptions = {
  token: process.env.GITHUB_TOKEN,
}

setGitHubCommitStatus(options, envOptions).catch((e) => {
  console.error(e)
  process.exit(1)
})
