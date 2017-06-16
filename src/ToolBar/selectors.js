"use strict";
exports.__esModule = true;
var fp_1 = require("lodash/fp");
exports.localesSelector = fp_1.getOr([], 'toolBar.locales');
exports.selectedLocaleSelector = fp_1.get('toolBar.selectedLocale');
exports.selectedObjectTypeSelector = fp_1.get('toolBar.selectedObjectType');
exports.objectTypesSelector = fp_1.getOr([], 'toolBar.objectTypes');
exports.selectedFilterSelector = fp_1.getOr('ALL', 'toolBar.selectedFilter');
exports.toolbarStateSelector = function (state) { return ({
    selectedLocale: exports.selectedLocaleSelector(state),
    selectedObjectType: exports.selectedObjectTypeSelector(state),
    selectedFilter: exports.selectedFilterSelector(state)
}); };
