import i18n from './locales'

export const DEFAULT_LOCALE = { id: 'en', name: 'English' }

const isLangRTL = code => {
    const langs = ['ar', 'fa', 'ur']
    const prefixed = langs.map(c => `${c}-`)
    return (
        langs.includes(code) ||
        prefixed.filter(c => code.startsWith(c)).length > 0
    )
}

export const configI18n = userSettings => {
    const lang = userSettings.keyUiLocale || DEFAULT_LOCALE.id
    if (isLangRTL(lang)) {
        document.body.setAttribute('dir', 'rtl')
    }

    i18n.changeLanguage(lang)
}

export default configI18n
