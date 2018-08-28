/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* d2-ui components */
import { SelectField, InputField } from '@dhis2/d2-ui-core';

const TranslationsSearch = props => (
    <div>
        <SelectField
            value={props.selectedLocaleId}
            onChange={props.onLocaleChange}
            items={props.localeSelectItems}
            label={props.localeSelectLabel}
        />
        <SelectField
            value={props.selectedObjectName}
            onChange={props.onObjectChange}
            items={props.objectSelectItems}
            label={props.objectSelectLabel}
        />
        <SelectField
            value={props.selectedFilterId}
            onChange={props.onFilterChange}
            items={props.filterBySelectItems}
            label={props.filterBySelectLabel}
        />
        <InputField
            value={props.searchTerm}
            type="text"
            label={props.searchFieldLabel}
            onChange={props.onSearchTermChange}
        />
    </div>
);

/* to avoid null exceptions */
const nonOnChangeHandler = () => null;

TranslationsSearch.propTypes = {
    localeSelectLabel: PropTypes.string.isRequired,
    localeSelectItems: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
    selectedLocaleId: PropTypes.string,
    onLocaleChange: PropTypes.func,
    objectSelectLabel: PropTypes.string.isRequired,
    objectSelectItems: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
    selectedObjectName: PropTypes.string,
    onObjectChange: PropTypes.func,
    filterBySelectLabel: PropTypes.string.isRequired,
    filterBySelectItems: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
    selectedFilterId: PropTypes.string,
    onFilterChange: PropTypes.func,
    searchFieldLabel: PropTypes.string.isRequired,
    searchTerm: PropTypes.string,
    onSearchTermChange: PropTypes.func,
};

TranslationsSearch.defaultProps = {
    selectedLocaleId: null,
    onLocaleChange: nonOnChangeHandler,
    selectedObjectName: null,
    onObjectChange: nonOnChangeHandler,
    selectedFilterId: null,
    onFilterChange: nonOnChangeHandler,
    searchTerm: '',
    onSearchTermChange: nonOnChangeHandler,
};

export default TranslationsSearch;
