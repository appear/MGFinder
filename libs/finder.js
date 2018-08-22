const ora = require('ora')
const prompt = require('prompts')
const { run, parse, getSelectedUrl, result } = require('./crawler')

const prompts = [
  {
    type: 'text',
    name: 'name',
    message: 'What is your find lib name ?'
  },
  {
    type: 'text',
    name: 'version',
    message: 'Please select a version (ex. 1)'
  },
  {
    type: 'text',
    name: 'category',
    message: '1. Maven / 2. Gradle'
  }
]

module.exports = async() => {
    const spinner = ora()
    spinner.color = 'yellow'

    const { name } = await prompt(prompts[0]);

    spinner.text = 'Searching ..... 😃'
    spinner.start()

    const href = await run(name)
    const parseData = await parse(href)
    spinner.stop();

    const { version } = await prompt(prompts[1])

    const url = getSelectedUrl(parseData, version)
    const { category } = await prompt(prompts[2])
    result(url, category)
}