"use strict";
exports.__esModule = true;
var fp_1 = require("lodash/fp");
var redux_observable_1 = require("redux-observable");
var rxjs_1 = require("rxjs");
var actions_1 = require("./actions");
var d2_helpers_1 = require("../d2-helpers");
exports.toolBarInit = function (action$) { return action$
    .ofType(actions_1.TOOLBAR_INIT__REQUEST)
    .mergeMap(function (action) { return d2_helpers_1.dbLocales$
    .combineLatest(d2_helpers_1.currentUserDbLocale$, d2_helpers_1.models$, function (locales, dbLocale, models) { return ({
    locales: fp_1.uniqBy(fp_1.get('locale'), locales),
    selectedLocale: dbLocale,
    objectTypes: fp_1.uniq(models.mapThroughDefinitions(function (d) { return d.name; })).sort(function (l, r) { return l.localeCompare(r); }),
    selectedObjectType: 'dataElements'
}); }); })
    .map(actions_1.initToolBar); };
var toolBarUpdated = function (action$) { return rxjs_1.Observable
    .merge(action$.ofType(actions_1.TOOLBAR_LOCALE_CHANGE), action$.ofType(actions_1.TOOLBAR_OBJECT_TYPE_CHANGE), action$.ofType(actions_1.TOOLBAR_FILTER_CHANGE))
    .mapTo({ type: actions_1.TOOLBAR_UPDATED }); };
exports["default"] = redux_observable_1.combineEpics(exports.toolBarInit, toolBarUpdated);
