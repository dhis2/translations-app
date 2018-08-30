/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* material-ui */
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

/* styles */
import { formStylesForTheme } from '../../styles';
import translationsSearchStyles from './TranslationsSearch.style';

const SelectControl = ({ classes, items, label, onChange, value }) => {
    /* passes the whole object and not only id */
    const onChangeEnhanced = (event) => {
        onChange(items.find(item => item.id === event.target.value));
    };

    return (
        <TextField
            select
            label={label}
            className={classes.formControl}
            value={value}
            onChange={onChangeEnhanced}
        >
            {items.map(item => (
                <MenuItem key={item.id} value={item.id}>
                    {item.name}
                </MenuItem>
            ))}
        </TextField>
    );
};

SelectControl.propTypes = {
    classes: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

SelectControl.defaultProps = {
    value: '',
    onChange: () => null,
};

const TranslationsSearch = ({ classes, ...props }) => (
    <div style={translationsSearchStyles.container}>
        <SelectControl
            id="locale-select"
            classes={classes}
            value={props.selectedLocaleId}
            onChange={props.onLocaleChange}
            items={props.localeSelectItems}
            label={props.localeSelectLabel}
        />
        <SelectControl
            id="object-select"
            classes={classes}
            value={props.selectedObjectName}
            onChange={props.onObjectChange}
            items={props.objectSelectItems}
            label={props.objectSelectLabel}
        />
        <SelectControl
            id="filter-select"
            classes={classes}
            value={props.selectedFilterId}
            onChange={props.onFilterChange}
            items={props.filterBySelectItems}
            label={props.filterBySelectLabel}
        />
        <TextField
            className={classes.formControl}
            label={props.searchFieldLabel}
            type="search"
            onChange={props.onSearchTermChange}
        />
    </div>
);

/* to avoid null exceptions */
const nonOnChangeHandler = () => null;

TranslationsSearch.propTypes = {
    classes: PropTypes.object.isRequired,
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

export default withStyles(formStylesForTheme)(TranslationsSearch);
