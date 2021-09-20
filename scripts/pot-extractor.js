require('import-export')
const { existsSync, mkdirSync, writeFileSync } = require('fs')
const { i18nextToPot } = require('i18next-conv')
const argv = require('minimist')(process.argv.slice(2))
const i18nKeys = require('../src/i18n.js')

const filename = argv.o || 'en.pot'

// save file to disk
const save = target => result => {
    writeFileSync(target, result)
}

const translations = {}
const addKeysFromConfigObject = obj => {
    for (const key in obj) {
        /* eslint-disable-next-line no-prototype-builtins */
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] == 'object') {
                addKeysFromConfigObject(obj[key])
            } else {
                translations[obj[key]] = ''
            }
        }
    }
}

addKeysFromConfigObject(i18nKeys)

if (!existsSync('i18n/')) {
    mkdirSync('i18n/')
}

i18nextToPot('en', JSON.stringify(translations)).then(save(`i18n/${filename}`))
