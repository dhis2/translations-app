"use strict";
exports.__esModule = true;
var redux_1 = require("redux");
var redux_observable_1 = require("redux-observable");
var epics_1 = require("./epics");
var actions_1 = require("./actions");
var reducers_1 = require("./reducers");
var epicMiddleware = redux_observable_1.createEpicMiddleware(epics_1["default"]);
var store = redux_1.createStore(reducers_1["default"], redux_1.applyMiddleware(epicMiddleware));
// Start of a sequence of actions to bootstrap the app with async loaded data.
store.dispatch(actions_1.startApp());
exports["default"] = store;
