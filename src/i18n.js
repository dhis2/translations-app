"use strict";
exports.__esModule = true;
var i18next_1 = require("i18next");
var i18next_xhr_backend_1 = require("i18next-xhr-backend");
function createI18n(locale) {
    return i18next_1["default"]
        .use(i18next_xhr_backend_1["default"])
        .init({
        fallbackLng: undefined,
        wait: true,
        // have a common namespace used around the full app
        ns: ['translations'],
        defaultNS: 'translations',
        debug: false,
        interpolation: {
            escapeValue: false
        }
    });
}
exports.createI18n = createI18n;
