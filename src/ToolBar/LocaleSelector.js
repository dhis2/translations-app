"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
exports.__esModule = true;
var fp_1 = require("lodash/fp");
var react_1 = require("react");
var redux_1 = require("redux");
var react_redux_1 = require("react-redux");
var SelectField_1 = require("material-ui/SelectField");
var MenuItem_1 = require("material-ui/MenuItem");
var react_i18next_1 = require("react-i18next");
var recompose_1 = require("recompose");
var selectors_1 = require("./selectors");
var actions_1 = require("./actions");
function LocaleSelector(_a) {
    var _b = _a.locales, locales = _b === void 0 ? [] : _b, currentLocale = _a.currentLocale, onLocaleChange = _a.onLocaleChange, selectLabel = _a.selectLabel;
    var localeItems = locales.map(function (locale) { return (<MenuItem_1["default"] key={locale.locale} value={locale.locale} primaryText={locale.name}/>); });
    return (<SelectField_1["default"] className="tool-bar--item" value={currentLocale} onChange={fp_1.compose(onLocaleChange, fp_1.nthArg(2))} floatingLabelText={selectLabel}>
            {localeItems}
        </SelectField_1["default"]>);
}
var mapStateToProps = function (state) { return ({
    locales: selectors_1.localesSelector(state),
    currentLocale: selectors_1.selectedLocaleSelector(state)
}); };
var mapDispatchToProps = redux_1.bindActionCreators.bind(null, {
    onLocaleChange: actions_1.changeLocale
});
var enhance = fp_1.compose(react_redux_1.connect(mapStateToProps, mapDispatchToProps), react_i18next_1.translate(), recompose_1.mapProps(function (_a) {
    var t = _a.t, props = __rest(_a, ["t"]);
    return (__assign({}, props, { selectLabel: t('Target Locale') }));
}));
exports["default"] = enhance(LocaleSelector);
