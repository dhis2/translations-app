/* i18n */
import { i18nKeys } from '../../i18n';
import i18n from '../../locales';

/* API Endpoints */
export const OBJECTS_API_URL = '/schemas';
export const LANGUAGES_API_URL = '/locales/db?paging=false';

/* Constants for Filter By Select */
export const ALL_ID = 'ALL';
export const TRANSLATED_ID = 'TRANSLATED';
export const UNTRANSLATED_ID = 'UNTRANSLATED';

export const FILTER_BY_ITEMS = [
    { id: ALL_ID, name: i18n.t(i18nKeys.searchToolbar.selects.filterBy.all) },
    { id: TRANSLATED_ID, name: i18n.t(i18nKeys.searchToolbar.selects.filterBy.translated) },
    { id: UNTRANSLATED_ID, name: i18n.t(i18nKeys.searchToolbar.selects.filterBy.untranslated) },
];
