/* i18n */
import { i18nKeys } from '../../i18n';
import i18n from '../../locales';
import { DEFAULT_LOCALE } from '../../configI18n';

/* API Endpoints */
export const OBJECTS_API_URL = '/schemas?fields=apiEndpoint,plural,relativeApiEndpoint,displayName,name,translatable,' +
    'properties[name,fieldName,translationKey]';
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
export const DEFAULT_TRANSLATABLE_PROPERTIES = [
    { name: 'name', fieldName: 'name', translationKey: 'NAME' },
    { name: 'shortName', fieldName: 'shortName', translationKey: 'SHORT_NAME' },
    { name: 'description', fieldName: 'description', translationKey: 'DESCRIPTION' },
    { name: 'formName', fieldName: 'formName', translationKey: 'FORM_NAME' },
];

export const INITIAL_LOCALES = [
    DEFAULT_LOCALE,
];

export const INITIAL_OBJECTS = [
    {
        id: 'userRole',
        name: 'User Authority Group',
        relativeApiEndpoint: '/userRoles',
        apiResponseProperty: 'userRoles',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'userGroup',
        name: 'User Group',
        relativeApiEndpoint: '/userGroups',
        apiResponseProperty: 'userGroups',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'constant',
        name: 'Constant',
        relativeApiEndpoint: '/constants',
        apiResponseProperty: 'constants',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'option',
        name: 'Option',
        relativeApiEndpoint: '/options',
        apiResponseProperty: 'options',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'optionSet',
        name: 'Option Set',
        relativeApiEndpoint: '/optionSets',
        apiResponseProperty: 'optionSets',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'optionGroup',
        name: 'Option Group',
        relativeApiEndpoint: '/optionGroups',
        apiResponseProperty: 'optionGroups',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'optionGroupSet',
        name: 'Option Group Set',
        relativeApiEndpoint: '/optionGroupSets',
        apiResponseProperty: 'optionGroupSets',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'attribute',
        name: 'Attribute',
        relativeApiEndpoint: '/attributes',
        apiResponseProperty: 'attributes',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'colorSet',
        name: 'Color Set',
        relativeApiEndpoint: '/colorSets',
        apiResponseProperty: 'colorSets',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'legendSet',
        name: 'Legend Set',
        relativeApiEndpoint: '/legendSets',
        apiResponseProperty: 'legendSets',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'organisationUnit',
        name: 'Organisation Unit',
        relativeApiEndpoint: '/organisationUnits',
        apiResponseProperty: 'organisationUnits',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'organisationUnitLevel',
        name: 'Organisation Unit Level',
        relativeApiEndpoint: '/organisationUnitLevels',
        apiResponseProperty: 'organisationUnitLevels',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'organisationUnitGroup',
        name: 'Organisation Unit Group',
        relativeApiEndpoint: '/organisationUnitGroups',
        apiResponseProperty: 'organisationUnitGroups',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'organisationUnitGroupSet',
        name: 'Organisation Unit Group Set',
        relativeApiEndpoint: '/organisationUnitGroupSets',
        apiResponseProperty: 'organisationUnitGroupSets',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'categoryOption',
        name: 'Category Option',
        relativeApiEndpoint: '/categoryOptions',
        apiResponseProperty: 'categoryOptions',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'categoryOptionGroup',
        name: 'Category Option Group',
        relativeApiEndpoint: '/categoryOptionGroups',
        apiResponseProperty: 'categoryOptionGroups',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'categoryOptionGroupSet',
        name: 'Category Option Group Set',
        relativeApiEndpoint: '/categoryOptionGroupSets',
        apiResponseProperty: 'categoryOptionGroupSets',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'category',
        name: 'Category',
        relativeApiEndpoint: '/categories',
        apiResponseProperty: 'categories',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'categoryCombo',
        name: 'Category Combo',
        relativeApiEndpoint: '/categoryCombos',
        apiResponseProperty: 'categoryCombos',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'categoryOptionCombo',
        name: 'Category Option Combo',
        relativeApiEndpoint: '/categoryOptionCombos',
        apiResponseProperty: 'categoryOptionCombos',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'dataElement',
        name: 'Data Element',
        relativeApiEndpoint: '/dataElements',
        apiResponseProperty: 'dataElements',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'dataElementGroup',
        name: 'Data Element Group',
        relativeApiEndpoint: '/dataElementGroups',
        apiResponseProperty: 'dataElementGroups',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'dataElementGroupSet',
        name: 'Data Element Group Set',
        relativeApiEndpoint: '/dataElementGroupSets',
        apiResponseProperty: 'dataElementGroupSets',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'indicatorType',
        name: 'Indicator Type',
        relativeApiEndpoint: '/indicatorTypes',
        apiResponseProperty: 'indicatorTypes',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'indicator',
        name: 'Indicator',
        relativeApiEndpoint: '/indicators',
        apiResponseProperty: 'indicators',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'indicatorGroup',
        name: 'Indicator Group',
        relativeApiEndpoint: '/indicatorGroups',
        apiResponseProperty: 'indicatorGroups',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'indicatorGroupSet',
        name: 'Indicator Group Set',
        relativeApiEndpoint: '/indicatorGroupSets',
        apiResponseProperty: 'indicatorGroupSets',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'dataSet',
        name: 'Data Set',
        relativeApiEndpoint: '/dataSets',
        apiResponseProperty: 'dataSets',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'section',
        name: 'Section',
        relativeApiEndpoint: '/sections',
        apiResponseProperty: 'sections',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'dataApprovalLevel',
        name: 'Data Approval Level',
        relativeApiEndpoint: '/dataApprovalLevels',
        apiResponseProperty: 'dataApprovalLevels',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'dataApprovalWorkflow',
        name: 'Data Approval Workflow',
        relativeApiEndpoint: '/dataApprovalWorkflows',
        apiResponseProperty: 'dataApprovalWorkflows',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'validationRule',
        name: 'Validation Rule',
        relativeApiEndpoint: '/validationRules',
        apiResponseProperty: 'validationRules',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'validationRuleGroup',
        name: 'Validation Rule Group',
        relativeApiEndpoint: '/validationRuleGroups',
        apiResponseProperty: 'validationRuleGroups',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'relationshipType',
        name: 'Relationship Type',
        relativeApiEndpoint: '/relationshipTypes',
        apiResponseProperty: 'relationshipTypes',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'trackedEntityType',
        name: 'Tracked Entity Type',
        relativeApiEndpoint: '/trackedEntityTypes',
        apiResponseProperty: 'trackedEntityTypes',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'trackedEntityAttribute',
        name: 'Tracked Entity Attribute',
        relativeApiEndpoint: '/trackedEntityAttributes',
        apiResponseProperty: 'trackedEntityAttributes',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'programTrackedEntityAttributeGroup',
        name: 'Program Tracked Entity Attribute Group',
        relativeApiEndpoint: '/programTrackedEntityAttributeGroups',
        apiResponseProperty: 'programTrackedEntityAttributeGroups',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'programStage',
        name: 'Program Stage',
        relativeApiEndpoint: '/programStages',
        apiResponseProperty: 'programStages',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'program',
        name: 'Program',
        relativeApiEndpoint: '/programs',
        apiResponseProperty: 'programs',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'eventReport',
        name: 'Event Report',
        relativeApiEndpoint: '/eventReports',
        apiResponseProperty: 'eventReports',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'eventChart',
        name: 'Event Chart',
        relativeApiEndpoint: '/eventCharts',
        apiResponseProperty: 'eventCharts',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'programIndicator',
        name: 'Program Indicator',
        relativeApiEndpoint: '/programIndicators',
        apiResponseProperty: 'programIndicators',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'programIndicatorGroup',
        name: 'Program Indicator Group',
        relativeApiEndpoint: '/programIndicatorGroups',
        apiResponseProperty: 'programIndicatorGroups',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'programRule',
        name: 'Program Rule',
        relativeApiEndpoint: '/programRules',
        apiResponseProperty: 'programRules',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'chart',
        name: 'Chart',
        relativeApiEndpoint: '/charts',
        apiResponseProperty: 'charts',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'map',
        name: 'Map',
        relativeApiEndpoint: '/maps',
        apiResponseProperty: 'maps',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'reportTable',
        name: 'Report Table',
        relativeApiEndpoint: '/reportTables',
        apiResponseProperty: 'reportTables',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'document',
        name: 'Document',
        relativeApiEndpoint: '/documents',
        apiResponseProperty: 'documents',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'report',
        name: 'Report',
        relativeApiEndpoint: '/reports',
        apiResponseProperty: 'reports',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'predictorGroup',
        name: 'Predictor Group',
        relativeApiEndpoint: '/predictorGroups',
        apiResponseProperty: 'predictorGroups',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'dashboardItem',
        name: 'Dashboard Item',
        relativeApiEndpoint: '/dashboardItems',
        apiResponseProperty: 'dashboardItems',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
    {
        id: 'dashboard',
        name: 'Dashboard',
        relativeApiEndpoint: '/dashboards',
        apiResponseProperty: 'dashboards',
        translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    },
];

export const INITIAL_PAGER = {
    pageSize: 5,
    page: 1,
    total: 0,
    pageCount: 1,
};

