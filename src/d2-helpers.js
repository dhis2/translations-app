"use strict";
exports.__esModule = true;
var d2_1 = require("d2/lib/d2");
var rxjs_1 = require("rxjs");
exports.d2$ = rxjs_1.Observable.fromPromise(d2_1.getInstance());
exports.api$ = exports.d2$.map(function (d2) { return d2.Api.getApi(); });
exports.dbLocales$ = exports.api$.mergeMap(function (api) { return rxjs_1.Observable.fromPromise(api.get('locales/db')); });
exports.currentUserDbLocale$ = exports.d2$.map(function (d2) { return d2.currentUser.userSettings.keyDbLocale; });
exports.models$ = exports.d2$.map(function (d2) { return d2.models; });
