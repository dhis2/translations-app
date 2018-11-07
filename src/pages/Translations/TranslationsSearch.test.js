/* eslint-disable */
/* React */
import React from 'react'

/* unit testing tools */
import { shallow } from 'enzyme'

/* material-ui */
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'

/* components */
import TranslationsSearch, { SelectControl } from './TranslationsSearch'

/* utils */
import { DEFAULT_LOCALE } from '../../configI18n'
import { INITIAL_LOCALES, FILTER_BY_ITEMS } from './translations.conf'

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
    {
        id: 'programTrackedEntityAttributeGroup',
        name: 'Program Tracked Entity Attribute Group',
    },
    { id: 'programStage', name: 'Program Stage' },
    { id: 'program', name: 'Program' },
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
]

const DEFAULT_SEARCH_PROPS = {
    localeSelectLabel: 'Locale',
    localeSelectItems: INITIAL_LOCALES,
    selectedLocaleId: DEFAULT_LOCALE.id,
    onLocaleChange: jest.fn(),
    filterBySelectLabel: 'Filter by',
    filterByItems: FILTER_BY_ITEMS,
    selectedFilterId: FILTER_BY_ITEMS[0].id,
    onFilterChange: jest.fn(),
    objectSelectLabel: 'Object',
    objectSelectItems: INITIAL_OBJECTS,
    selectedObjectName: INITIAL_OBJECTS[0].id,
    onObjectChange: jest.fn(),
    searchFieldLabel: 'Search',
    onSearchTermChange: jest.fn(),
    onSearchKeyPress: jest.fn(),
}

const DEFAULT_SELECT_PROPS = {
    label: 'Select',
    items: INITIAL_OBJECTS,
    onChange: jest.fn(),
}

const searchShallow = (props = DEFAULT_SEARCH_PROPS) => {
    return shallow(<TranslationsSearch {...props} />, {
        disableLifecycleMethods: true,
    })
}

const selectShallow = (props = DEFAULT_SELECT_PROPS) => {
    return shallow(<SelectControl {...props} />, {
        disableLifecycleMethods: true,
    })
}

describe('Test <SelectControl /> rendering:', () => {
    let wrapper
    beforeEach(() => {
        wrapper = selectShallow()
    })

    it('Should render without crashing', () => {
        selectShallow()
    })

    it('Should renders one TextField', () => {
        expect(wrapper.find(TextField)).toHaveLength(1)
    })

    it('Should renders the correct numbers of options', () => {
        expect(wrapper.find(MenuItem)).toHaveLength(INITIAL_OBJECTS.length)
    })
})

describe('Test <SelectControl /> actions:', () => {
    let wrapper
    beforeEach(() => {
        wrapper = selectShallow()
    })

    it('Should call onChange function when selected option changes.', () => {
        wrapper
            .find(TextField)
            .first()
            .simulate('change', {
                target: {
                    value: 'newId',
                },
            })
        expect(DEFAULT_SELECT_PROPS.onChange).toHaveBeenCalled()
    })
})

describe('Test <TranslationsSearch /> rendering:', () => {
    let wrapper
    beforeEach(() => {
        wrapper = searchShallow()
    })

    it('Should render without crashing', () => {
        searchShallow()
    })

    it('Should renders three SelectControls for locales and objects', () => {
        expect(wrapper.find(SelectControl)).toHaveLength(3)
    })

    it('Should renders one TextField for Search', () => {
        expect(wrapper.find(TextField)).toHaveLength(1)
    })
})

describe('Test <TranslationsSearch /> actions:', () => {
    let wrapper
    beforeEach(() => {
        wrapper = searchShallow()
    })

    it('Should call onObjectChange function when locale option changes.', () => {
        wrapper
            .find(SelectControl)
            .first()
            .simulate('change', {
                target: {
                    value: 'newObjectId',
                },
            })
        expect(DEFAULT_SEARCH_PROPS.onObjectChange).toHaveBeenCalled()
    })

    it('Should call onFilterChange function when filter option changes.', () => {
        wrapper
            .find(SelectControl)
            .at(1)
            .simulate('change', {
                target: {
                    value: 'newFilterId',
                },
            })
        expect(DEFAULT_SEARCH_PROPS.onFilterChange).toHaveBeenCalled()
    })

    it('Should call onLocaleChange function when object option changes.', () => {
        wrapper
            .find(SelectControl)
            .at(2)
            .simulate('change', {
                target: {
                    value: 'newLocaleId',
                },
            })
        expect(DEFAULT_SEARCH_PROPS.onLocaleChange).toHaveBeenCalled()
    })

    it('Should call onSearchTermChange function when search term changes.', () => {
        wrapper.find(TextField).simulate('change', {
            target: {
                value: 'newSearch',
            },
        })
        expect(DEFAULT_SEARCH_PROPS.onSearchTermChange).toHaveBeenCalled()
    })

    it('Should call onSearchKeyPress function when key is pressed for search field.', () => {
        wrapper.find(TextField).simulate('keyPress')
        expect(DEFAULT_SEARCH_PROPS.onSearchKeyPress).toHaveBeenCalled()
    })
})
