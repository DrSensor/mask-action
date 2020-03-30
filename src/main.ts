import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    const commands = core.getInput('commands').split('\n')
    const parallel = core.getInput('parallel') === 'true'


  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
