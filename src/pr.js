if (!process.env.GITHUB_EVENT) {
  console.log('GITHUB_EVENT is not defined')
  process.exit(0)
}
const ghEvent = JSON.parse(process.env.GITHUB_EVENT)
if (ghEvent.action !== 'edited') {
  console.log('GITHUB_EVENT.action is not edited')
  process.exit(0)
}

console.log('PR body before')
console.log(ghEvent.changes.body.from)
console.log('PR body after')
console.log(ghEvent.body)
