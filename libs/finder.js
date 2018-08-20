const ora = require('ora')
const prompt = require('prompts')

module.exports = (flags) => {
    const spinner = ora(`let's start serach Maven and Gradle 😃`).start()
    spinner.color = 'yellow'

    const choice = prompt([{
        type: 'autocomplete',
        name: 'init',
        message: '',
    }])

    spinner.test = `${choice.init}`
}