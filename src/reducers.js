"use strict";
exports.__esModule = true;
var redux_1 = require("redux");
var reducers_1 = require("./ToolBar/reducers");
var reducers_2 = require("./TranslationForm/reducers");
exports["default"] = redux_1.combineReducers({
    toolBar: reducers_1.toolBarReducer,
    translationForm: reducers_2.translationFormReducer
});
