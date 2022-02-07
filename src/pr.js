if (!process.env.GITHUB_EVENT) {
  console.log('GITHUB_EVENT is not defined')
  process.exit(0)
}
const ghEvent = JSON.parse(process.env.GITHUB_EVENT)
if (ghEvent.action !== 'edited') {
  console.log('GITHUB_EVENT.action is not edited')
  process.exit(0)
}

// TODO check if this was really an edit of the PR body
console.log('PR body before')
console.log(ghEvent.changes.body.from)
console.log('PR body after')
console.log(ghEvent.pull_request.body)

const runTestsCheckboxUnfilled = '[ ] re-run the tests'
const runTestsCheckboxFilled = '[x] re-run the tests'
if (
  ghEvent.changes.body.from.includes(runTestsCheckboxUnfilled) &&
  ghEvent.pull_request.body.includes(runTestsCheckboxFilled)
) {
  console.log('Running tests')
}