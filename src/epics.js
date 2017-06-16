"use strict";
exports.__esModule = true;
var redux_observable_1 = require("redux-observable");
var actions_1 = require("./actions");
var actions_2 = require("./TranslationForm/actions");
var epics_1 = require("./TranslationForm/epics");
var epics_2 = require("./ToolBar/epics");
var actions_3 = require("./ToolBar/actions");
var actions_4 = require("./ToolBar/actions");
var selectors_1 = require("./ToolBar/selectors");
var appStartEpic = function (action$) { return action$
    .ofType(actions_1.APP_START)
    .mapTo(actions_3.initToolBarRequest()); };
function allFiltersSet(toolBarState) {
    return Boolean(toolBarState.selectedFilter && toolBarState.selectedObjectType && toolBarState.selectedLocale);
}
var appToolBarUpdated = function (action$, store) { return action$
    .ofType(actions_4.TOOLBAR_UPDATED)
    .map(function (action) { return store.getState(); })
    .map(selectors_1.toolbarStateSelector)
    .filter(allFiltersSet)
    .distinctUntilKeyChanged('selectedObjectType')
    .map(actions_2.loadObjectsToTranslate); };
exports["default"] = redux_observable_1.combineEpics(appStartEpic, appToolBarUpdated, epics_1["default"], epics_2["default"]);
