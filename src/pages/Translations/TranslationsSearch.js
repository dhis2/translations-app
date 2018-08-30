/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* material-ui */
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

/* styles */
import styles from './TranslationsSearch.style';

const formStyles = theme => ({
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
});

const SelectControl = ({ classes, id, items, label, onChange, value }) => {
    /* passes the whole object and not only id */
    const onChangeEnhanced = (event) => {
        onChange(items.find(item => item.id === event.target.value));
    };

    return (
        <FormControl className={classes.formControl}>
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <Select
                value={value}
                onChange={onChangeEnhanced}
                inputProps={{
                    name: label,
                    id,
                }}
            >
                {items.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                        {item.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

SelectControl.propTypes = {
    classes: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
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
    <div style={styles.container}>
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
        <FormControl className={classes.formControl}>
            <TextField
                label={props.searchFieldLabel}
                type="search"
                onChange={props.onSearchTermChange}
            />
        </FormControl>
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

export default withStyles(formStyles)(TranslationsSearch);
