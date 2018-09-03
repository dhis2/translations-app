/* i18n */
import { DEFAULT_LOCALE } from '../../configI18n';

/* API Endpoints */
export const LANGUAGES_API_URL = '/locales/db?paging=false';

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

