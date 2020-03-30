import * as core from '@actions/core'
import {Octokit} from '@octokit/rest'
import {downloadTool, extractZip, cacheDir} from '@actions/tool-cache'
import {platform as getOS} from 'os'
import * as path from 'path'
import {randomBytes} from 'crypto'

const MASK_REPO = {
  owner: 'jakedeichert',
  repo: 'mask'
}
const INSTALL_PATH = randomBytes(3).toString('hex')

async function run(): Promise<void> {
  try {
    const commands = core.getInput('commands').split('\n')
    const parallel = core.getInput('parallel') === 'true'
    const auth = core.getInput('github-token')
    const octokit = new Octokit({auth})

    core.startGroup('install mask')
    const {data: release} = await octokit.repos.getLatestRelease(MASK_REPO)
    const assets = release.assets
      .filter(({content_type: s}) => s.includes('octet-stream'))
      .map(({name, browser_download_url: downloadURL}) => ({
        downloadURL,
        name: name.replace('.zip', ''),
        platform: name.match(/darwin|linux|windows|openbsd|sun-solaris/)?.[0]
      }))

    const {downloadURL, name} = assets.filter(({platform: o}) => o === getOS())[0]
    const zipFile = await downloadTool(downloadURL)
    const extractPath = await extractZip(zipFile, INSTALL_PATH)
    const cache = await cacheDir(
      path.join(extractPath, name),
      'mask',
      release.tag_name
    )
    core.addPath(cache)
    core.endGroup()

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
