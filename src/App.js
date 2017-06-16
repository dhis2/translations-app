"use strict";
exports.__esModule = true;
var react_1 = require("react");
var prop_types_1 = require("prop-types");
var recompose_1 = require("recompose");
var react_tap_event_plugin_1 = require("react-tap-event-plugin");
var HeaderBar_1 = require("./HeaderBar/HeaderBar");
var ToolBar_1 = require("./ToolBar/ToolBar");
var Translations_jsx_1 = require("./TranslationForm/Translations.jsx");
require("./App.scss");
react_tap_event_plugin_1["default"]();
function App() {
    return (<div id="app-wrapper" className="app-wrapper">
            <HeaderBar_1["default"] />
            <ToolBar_1["default"] />
            <Translations_jsx_1["default"] />
        </div>);
}
var withD2Context = recompose_1.withContext({ d2: prop_types_1["default"].object }, function (_a) {
    var d2 = _a.d2;
    return ({ d2: d2 });
});
exports["default"] = withD2Context(App);
