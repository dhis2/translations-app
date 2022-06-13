/* i18n */
import { DEFAULT_LOCALE } from '../../configI18n.js'
import { i18nKeys } from '../../i18n.js'
import i18n from '../../locales/index.js'

/* API Endpoints */
export const LANGUAGES_API_URL = '/locales/db?paging=false'

/* Constants for Filter By Select */
export const ALL_ID = 'ALL'
export const TRANSLATED_ID = 'TRANSLATED'
export const UNTRANSLATED_ID = 'UNTRANSLATED'
export const PARTIAL_TRANSLATED_ID = 'PARTIAL_TRANSLATED'

export const ALL_ITEM = {
    id: ALL_ID,
    name: i18n.t(i18nKeys.searchToolbar.selects.filterBy.all),
}
export const TRANSLATED_ITEM = {
    id: TRANSLATED_ID,
    name: i18n.t(i18nKeys.searchToolbar.selects.filterBy.translated),
}

export const UNTRANSLATED_ITEM = {
    id: UNTRANSLATED_ID,
    name: i18n.t(i18nKeys.searchToolbar.selects.filterBy.untranslated),
}

export const PARTIAL_TRANSLATED_ITEM = {
    id: PARTIAL_TRANSLATED_ID,
    name: i18n.t(i18nKeys.searchToolbar.selects.filterBy.partialTranslated),
}

export const FILTER_BY_ITEMS = [
    ALL_ITEM,
    TRANSLATED_ITEM,
    PARTIAL_TRANSLATED_ITEM,
    UNTRANSLATED_ITEM,
]

export const DEFAULT_TRANSLATABLE_PROPERTIES = [
    { name: 'name', translationKey: 'NAME' },
    { name: 'shortName', translationKey: 'SHORT_NAME' },
    { name: 'description', translationKey: 'DESCRIPTION' },
    { name: 'formName', translationKey: 'FORM_NAME' },
]

export const INITIAL_LOCALES = [DEFAULT_LOCALE]

export const INITIAL_PAGER = {
    pageSize: 5,
    page: 1,
    total: 0,
    pageCount: 1,
}
