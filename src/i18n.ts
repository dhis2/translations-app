import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';

export function createI18n(locale: string) {
    return i18n
        .use(XHR)
        .init({
            lng: locale,
            fallbackLng: undefined, // Set fallbackLng to false to make sure we use getText
            wait: true, // globally set to wait for loaded translations in translate hoc

            // have a common namespace used around the full app
            ns: ['translations'],
            defaultNS: 'translations',

            debug: false,

            interpolation: {
                escapeValue: false,
            }
        });
}
