import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Search from '@material-ui/icons/Search.js'
import PropTypes from 'prop-types'
import React from 'react'
import styles from '../../styles.js'
import translationsSearchStyles from './TranslationsSearch.style.js'

export const SelectControl = ({
    items,
    label,
    onChange = () => null,
    value = '',
}) => {
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

/* to avoid null exceptions */
const nonHandler = () => null

const TranslationsSearch = ({
    filterByItems = [],
    filterBySelectLabel,
    localeSelectItems = [],
    localeSelectLabel,
    objectSelectItems = [],
    objectSelectLabel,
    searchFieldLabel,
    searchTerm = '',
    selectedFilterId = null,
    selectedLocaleId = null,
    selectedObjectName = null,
    onFilterChange = nonHandler,
    onLocaleChange = nonHandler,
    onObjectChange = nonHandler,
    onSearchKeyPress = nonHandler,
    onSearchTermChange = nonHandler,
}) => {
    const onChangeForSearchFieldEnhanced = (event) => {
        onSearchTermChange(event.target.value)
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
                        value={selectedObjectName}
                        onChange={onObjectChange}
                        items={objectSelectItems}
                        label={objectSelectLabel}
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
                        value={selectedFilterId}
                        onChange={onFilterChange}
                        items={filterByItems}
                        label={filterBySelectLabel}
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
                        value={selectedLocaleId}
                        onChange={onLocaleChange}
                        items={localeSelectItems}
                        label={localeSelectLabel}
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
                        label={searchFieldLabel}
                        type="search"
                        value={searchTerm}
                        onChange={onChangeForSearchFieldEnhanced}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                        onKeyPress={onSearchKeyPress}
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

export default TranslationsSearch
