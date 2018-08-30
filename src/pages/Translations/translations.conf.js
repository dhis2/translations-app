/* i18n */
import { i18nKeys } from '../../i18n';
import i18n from '../../locales';

/* API Endpoints */
export const OBJECTS_API_URL = '/schemas';
export const LANGUAGES_API_URL = '/locales/db?paging=false';

/* Constants for Filter By Select */
export const ALL_ID = 'ALL';
export const TRANSLATED_ID = 'TRANSLATED';
export const UNTRANSLATED_ID = 'UNTRANSLATED';

export const ALL_ITEM = {
    id: ALL_ID,
    name: i18n.t(i18nKeys.searchToolbar.selects.filterBy.all),
};
export const TRANSLATED_ITEM = {
    id: TRANSLATED_ID,
    name: i18n.t(i18nKeys.searchToolbar.selects.filterBy.translated),
};

export const UNTRANSLATED_ITEM = {
    id: UNTRANSLATED_ID,
    name: i18n.t(i18nKeys.searchToolbar.selects.filterBy.untranslated),
};

export const FILTER_BY_ITEMS = [ALL_ITEM, TRANSLATED_ITEM, UNTRANSLATED_ITEM];

/* those values are used when server has not fetched data from api yet */
export const INITIAL_LOCALES = [
    { id: 'en', name: 'English' },
];

export const INITIAL_OBJECTS = [
    { id: 'userRole', name: 'User Authority Group' },
    { id: 'userGroup', name: 'User Group' },
    { id: 'constant', name: 'Constant' },
    { id: 'option', name: 'Option' },
    { id: 'optionSet', name: 'Option Set' },
    { id: 'optionGroupSet', name: 'Option Group Set' },
    { id: 'optionGroup', name: 'Option Group' },
    { id: 'attribute', name: 'Attribute' },
    { id: 'legendSet', name: 'Legend Set' },
    { id: 'colorSet', name: 'Color Set' },
    { id: 'organisationUnit', name: 'Organisation Unit' },
    { id: 'organisationUnitLevel', name: 'Organisation Unit Level' },
    { id: 'organisationUnitGroup', name: 'Organisation Unit Group' },
    { id: 'organisationUnitGroupSet', name: 'Organisation Unit Group Set' },
    { id: 'categoryOption', name: 'Category Option' },
    { id: 'categoryOptionGroup', name: 'Category Option Group' },
    { id: 'categoryOptionGroupSet', name: 'Category Option Group Set' },
    { id: 'category', name: 'Category' },
    { id: 'categoryCombo', name: 'Category Combo' },
    { id: 'categoryOptionCombo', name: 'Category Option Combo' },
    { id: 'dataElement', name: 'Data Element' },
    { id: 'dataElementGroup', name: 'Data Element Group' },
    { id: 'dataElementGroupSet', name: 'Data Element Group Set' },
    { id: 'indicatorType', name: 'Indicator Type' },
    { id: 'indicator', name: 'Indicator' },
    { id: 'indicatorGroup', name: 'Indicator Group' },
    { id: 'indicatorGroupSet', name: 'Indicator Group Set' },
    { id: 'dataSet', name: 'Data Set' },
    { id: 'section', name: 'Section' },
    { id: 'dataApprovalLevel', name: 'Data Approval Level' },
    { id: 'dataApprovalWorkflow', name: 'Data Approval Workflow' },
    { id: 'validationRule', name: 'Validation Rule' },
    { id: 'validationRuleGroup', name: 'Validation Rule Group' },
    { id: 'relationshipType', name: 'Relationship Type' },
    { id: 'trackedEntityType', name: 'Tracked Entity Type' },
    { id: 'trackedEntityAttribute', name: 'Tracked Entity Attribute' },
    { id: 'programTrackedEntityAttributeGroup', name: 'Program Tracked Entity Attribute Group' },
    { id: 'programStage', name: 'Program Stage' }, { id: 'program', name: 'Program' },
    { id: 'eventReport', name: 'Event Report' },
    { id: 'eventChart', name: 'Event Chart' },
    { id: 'programIndicator', name: 'Program Indicator' },
    { id: 'programIndicatorGroup', name: 'Program Indicator Group' },
    { id: 'programRule', name: 'Program Rule' },
    { id: 'report', name: 'Report' },
    { id: 'chart', name: 'Chart' },
    { id: 'reportTable', name: 'Report Table' },
    { id: 'map', name: 'Map' },
    { id: 'document', name: 'Document' },
    { id: 'predictorGroup', name: 'Predictor Group' },
    { id: 'dashboardItem', name: 'Dashboard Item' },
    { id: 'dashboard', name: 'Dashboard' },
];

export const INITIAL_PAGER = {
    pageSize: 5,
    page: 1,
    total: 0,
    pageCount: 1,
};

