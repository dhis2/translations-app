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
var react_1 = require("react");
var prop_types_1 = require("prop-types");
var fp_1 = require("lodash/fp");
var redux_1 = require("redux");
var react_redux_1 = require("react-redux");
var SelectField_1 = require("material-ui/SelectField");
var MenuItem_1 = require("material-ui/MenuItem");
var react_i18next_1 = require("react-i18next");
var recompose_1 = require("recompose");
var actions_1 = require("./actions");
var selectors_1 = require("./selectors");
function getStyle(active, item) {
    if (active === item) {
        return { color: "blue", background: '#ddd' };
    }
    return {};
}
var ObjectTypeSelector = function (_a, _b) {
    var _c = _a.items, items = _c === void 0 ? [] : _c, _d = _a.action, action = _d === void 0 ? fp_1.noop : _d, active = _a.active, hintText = _a.hintText, labelText = _a.labelText;
    var d2 = _b.d2;
    var menuItems = items
        .map(function (schemaName) { return d2.models[schemaName]; })
        .filter(function (schema) { return schema && schema.getTranslatableProperties().length > 0 && d2.currentUser.canUpdate(schema); })
        .map(function (item) { return (<MenuItem_1["default"] key={item.plural} value={item.plural} primaryText={item.displayName} style={getStyle(active, item.plural)}/>); });
    return (<SelectField_1["default"] className="tool-bar--item" value={active} onChange={function (event, index, value) { return action(value); }} floatingLabelText={labelText} hintText={hintText} autoWidth={true}>
            {menuItems}
        </SelectField_1["default"]>);
};
ObjectTypeSelector.contextTypes = {
    d2: prop_types_1["default"].object
};
var mapStateToProps = function (state) { return ({
    active: selectors_1.selectedObjectTypeSelector(state),
    items: selectors_1.objectTypesSelector(state)
}); };
var mapDispatchToProps = redux_1.bindActionCreators.bind(null, {
    action: actions_1.changeObjectType
});
var enhance = fp_1.compose(react_redux_1.connect(mapStateToProps, mapDispatchToProps), react_i18next_1.translate(), recompose_1.mapProps(function (_a) {
    var t = _a.t, props = __rest(_a, ["t"]);
    return (__assign({}, props, { hintText: t('Object Menu'), labelText: t('Select an Object Type') }));
}));
exports["default"] = enhance(ObjectTypeSelector);
