import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Search from '@material-ui/icons/Search.js'
import PropTypes from 'prop-types'
import React from 'react'
import styles from '../../styles.js'
import translationsSearchStyles from './TranslationsSearch.style.js'

export const SelectControl = ({ items, label, onChange, value }) => {
    /* passes the whole object and not only id */
    const onChangeEnhanced = (event) => {
        onChange(items.find((item) => item.id === event.target.value))
    }

    return (
        <TextField
            select
            label={label}
            value={value}
            onChange={onChangeEnhanced}
            fullWidth
        >
            {items.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                    {item.name}
                </MenuItem>
            ))}
        </TextField>
    )
}

SelectControl.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
}

SelectControl.defaultProps = {
    value: '',
    onChange: () => null,
}

/* to avoid null exceptions */
const nonHandler = () => null

const TranslationsSearch = (props) => {
    const onChangeForSearchFieldEnhanced = (event) => {
        props.onSearchTermChange(event.target.value)
    }

    return (
        <div style={translationsSearchStyles.container}>
            <Grid container>
                <Grid
                    id={'select-object-id'}
                    item
                    xs={12}
                    md={3}
                    style={styles.formControl}
                >
                    <SelectControl
                        value={props.selectedObjectName}
                        onChange={props.onObjectChange}
                        items={props.objectSelectItems}
                        label={props.objectSelectLabel}
                    />
                </Grid>
                <Grid
                    id={'select-filter-id'}
                    item
                    xs={12}
                    md={3}
                    style={styles.formControl}
                >
                    <SelectControl
                        value={props.selectedFilterId}
                        onChange={props.onFilterChange}
                        items={props.filterByItems}
                        label={props.filterBySelectLabel}
                    />
                </Grid>
                <Grid
                    id={'select-locale-id'}
                    item
                    xs={12}
                    md={3}
                    style={styles.formControl}
                >
                    <SelectControl
                        value={props.selectedLocaleId}
                        onChange={props.onLocaleChange}
                        items={props.localeSelectItems}
                        label={props.localeSelectLabel}
                    />
                </Grid>
                <Grid
                    id={'select-search-id'}
                    item
                    xs={12}
                    md={3}
                    style={styles.formControl}
                >
                    <TextField
                        label={props.searchFieldLabel}
                        type="search"
                        value={props.searchTerm}
                        onChange={onChangeForSearchFieldEnhanced}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                        onKeyPress={props.onSearchKeyPress}
                    />
                </Grid>
            </Grid>
        </div>
    )
}

TranslationsSearch.propTypes = {
    filterByItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    filterBySelectLabel: PropTypes.string.isRequired,
    localeSelectItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    localeSelectLabel: PropTypes.string.isRequired,
    objectSelectItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    objectSelectLabel: PropTypes.string.isRequired,
    searchFieldLabel: PropTypes.string.isRequired,
    searchTerm: PropTypes.string,
    selectedFilterId: PropTypes.string,
    selectedLocaleId: PropTypes.string,
    selectedObjectName: PropTypes.string,
    onFilterChange: PropTypes.func,
    onLocaleChange: PropTypes.func,
    onObjectChange: PropTypes.func,
    onSearchKeyPress: PropTypes.func,
    onSearchTermChange: PropTypes.func,
}

TranslationsSearch.defaultProps = {
    selectedLocaleId: null,
    onLocaleChange: nonHandler,
    selectedFilterId: null,
    onFilterChange: nonHandler,
    selectedObjectName: null,
    onObjectChange: nonHandler,
    searchTerm: '',
    onSearchTermChange: nonHandler,
    onSearchKeyPress: nonHandler,
}

export default TranslationsSearch
