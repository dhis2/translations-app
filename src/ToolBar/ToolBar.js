"use strict";
exports.__esModule = true;
var react_1 = require("react");
var LocaleSelector_1 = require("./LocaleSelector");
var ObjectTypeSelector_1 = require("./ObjectTypeSelector");
var TranslationStatusFilter_1 = require("./TranslationStatusFilter");
require("./ToolBar.scss");
function ToolBar() {
    return (<div className="tool-bar">
            <LocaleSelector_1["default"] />
            <ObjectTypeSelector_1["default"] />
            <TranslationStatusFilter_1["default"] />
        </div>);
}
exports["default"] = ToolBar;
