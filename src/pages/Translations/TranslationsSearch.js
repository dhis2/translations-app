/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* material-ui */
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';

/* styles */
import styles from '../../styles';
import translationsSearchStyles from './TranslationsSearch.style';

const SelectControl = ({ items, label, onChange, value }) => {
    /* passes the whole object and not only id */
    const onChangeEnhanced = (event) => {
        onChange(items.find(item => item.id === event.target.value));
    };

    return (
        <TextField
            select
            label={label}
            value={value}
            onChange={onChangeEnhanced}
            fullWidth
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

/* to avoid null exceptions */
const nonOnChangeHandler = () => null;

const TranslationsSearch = ({ ...props }) => (
    <div style={translationsSearchStyles.container}>
        <Grid container>
            <Grid item xs={12} md={6} lg={3} style={styles.formControl}>
                <SelectControl
                    value={props.selectedLocaleId}
                    onChange={props.onLocaleChange}
                    items={props.localeSelectItems}
                    label={props.localeSelectLabel}
                />
            </Grid>
            <Grid item xs={12} md={6} lg={3} style={styles.formControl}>
                <SelectControl
                    value={props.selectedObjectName}
                    onChange={props.onObjectChange}
                    items={props.objectSelectItems}
                    label={props.objectSelectLabel}
                />
            </Grid>
            <Grid item xs={12} md={6} lg={3} style={styles.formControl}>
                <SelectControl
                    value={props.selectedFilterId}
                    onChange={props.onFilterChange}
                    items={props.filterBySelectItems}
                    label={props.filterBySelectLabel}
                />
            </Grid>
            <Grid item xs={12} md={6} lg={3} style={styles.formControl}>
                <TextField
                    label={props.searchFieldLabel}
                    type="search"
                    onChange={props.onSearchTermChange}
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
        </Grid>
    </div>
);

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
