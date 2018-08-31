/* i18n */
import { i18nKeys } from '../../i18n';
import i18n from '../../locales';
import { DEFAULT_LOCALE } from '../../configI18n';

/* API Endpoints */
export const LANGUAGES_API_URL = '/locales/db?paging=false';

/* Constants for Filter By Select */
export const ALL_ID = 'ALL';
export const TRANSLATED_ID = 'TRANSLATED';
export const UNTRANSLATED_ID = 'UNTRANSLATED';

export const ALL_ITEM = {
    id: ALL_ID,
    name: i18n.t(i18nKeys.searchToolbar.selects.filterBy.all),
};
export const TRANSLATED_ITEM = {
    id: TRANSLATED_ID,
    name: i18n.t(i18nKeys.searchToolbar.selects.filterBy.translated),
};

export const UNTRANSLATED_ITEM = {
    id: UNTRANSLATED_ID,
    name: i18n.t(i18nKeys.searchToolbar.selects.filterBy.untranslated),
};

export const FILTER_BY_ITEMS = [ALL_ITEM, TRANSLATED_ITEM, UNTRANSLATED_ITEM];

/* those values are used when server has not fetched data from api yet */
export const DEFAULT_TRANSLATABLE_PROPERTIES = [
    { name: 'name', translationKey: 'NAME' },
    { name: 'shortName', translationKey: 'SHORT_NAME' },
    { name: 'description', translationKey: 'DESCRIPTION' },
    { name: 'formName', translationKey: 'FORM_NAME' },
];

export const INITIAL_LOCALES = [
    DEFAULT_LOCALE,
];

export const INITIAL_PAGER = {
    pageSize: 5,
    page: 1,
    total: 0,
    pageCount: 1,
};

