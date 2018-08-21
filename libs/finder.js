const ora = require('ora')
const prompt = require('prompts')
const { run, print, parse, getUrl, result } = require('./crawler')

module.exports = async(flags) => {
    const spinner = ora()
    spinner.color = 'yellow'

    const libray = await prompt({
        type: 'text',
        name: 'name',
        message: '라이브러리 이름이 뭐에여?'
    });

    spinner.text = 'Searching ..... :) '
    spinner.start()

    const href = await run(libray.name)
    const obj = await parse(href)
    spinner.stop();

    const p = await print(obj)

    const version = await prompt({
        type: 'text',
        name: 'number',
        message: 'version 을 선택해주세요'
    })

    const url = await getUrl(obj, version.number)
    const type = await prompt({
        type: 'text',
        name: 'category',
        message: 'maven(1) / gradle(2)'
    })
    spinner.start()
    const r = await result(url, type.category)
    spinner.stop()
}