'use strict'

const meow = require('meow')
const keyperss = require('keypress')
const finder = require('../libs/finder')

process.stdin.on('keypress', (ch, key) => {
    console.log('ch', ch)
    console.log('key', key)
})

const cli = meow(`
    Usage
      $ office <input>
    Sub Command
      $ office mgfinder Search SSID
    Options
      --filter, -f  Filter by
    Examples
      $ office mgfinder --filter=iptime
      🌈 unicorns 🌈
`, {
    flags: {
        filter: {
            type: 'string',
            alias: 'f'
        }
    }
});

finder(cli.flags)