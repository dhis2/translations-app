"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var actions_1 = require("./actions");
var initState = {
    locales: [],
    selectedLocale: undefined,
    objectTypes: [],
    selectedObjectType: undefined,
    filters: [],
    selectedFilter: undefined
};
function toolBarReducer(state, action) {
    if (state === void 0) { state = initState; }
    console.log(action);
    switch (action.type) {
        case actions_1.TOOLBAR_INIT:
            return __assign({}, state, action.payload);
        case actions_1.TOOLBAR_LOCALE_CHANGE:
            return __assign({}, state, { selectedLocale: action.payload });
        case actions_1.TOOLBAR_OBJECT_TYPE_CHANGE:
            return __assign({}, state, { selectedObjectType: action.payload });
        case actions_1.TOOLBAR_FILTER_CHANGE:
            return __assign({}, state, { selectedFilter: action.payload });
    }
    return state;
}
exports.toolBarReducer = toolBarReducer;
