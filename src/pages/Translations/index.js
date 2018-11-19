/* React */
import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'

/* d2-ui */
import { FeedbackSnackbar, CircularProgress } from '@dhis2/d2-ui-core'
import ConfirmationDialog from './ConfirmationDialog'

/* components */
import TranslationsSearch from './TranslationsSearch'
import TranslationsList from './TranslationsList'

/* i18n */
import { i18nKeys } from '../../i18n'
import i18n from '../../locales'

/* utils */
import * as PAGE_CONFIGS from './translations.conf'
import * as FEEDBACK_SNACKBAR_TYPES from '../../utils/feedbackSnackBarTypes'
import { filterElementsToPager } from '../../utils/pagination'
import { DEFAULT_LOCALE } from '../../configI18n'

/* styles */
import styles from '../../styles'

/* constants */
const DEFAULT_SNACKBAR_CONF = {
    type: FEEDBACK_SNACKBAR_TYPES.NONE,
    message: '',
    action: '',
    onActionClick: null,
}

/* auxiliar methods */
/* FIXME move to an external file, SchemaEntry class */
const modelToSchemaEntry = model => ({
    id: model.name,
    name: model.displayName,
    translatableProperties: model.getTranslatablePropertiesWithKeys(),
    apiEndpoint: model.apiEndpoint,
})

/* FIXME move to an external file, Element class */
/* receives a fat element and translatableProperties to filter translations and translationState for locale */
/* returns an element only with needed information */
const flatElementForPropertiesAndLocale = (
    element,
    translatableProperties,
    localeId
) => {
    const translations = []
    let translatedProperties = 0

    for (let j = 0; j < translatableProperties.length; j++) {
        const property = translatableProperties[j]
        const translationForPropertyAndLocale = element.translations.find(
            t =>
                t.property === property.translationKey &&
                t.locale === localeId &&
                t.value.trim().length
        )

        if (translationForPropertyAndLocale) {
            translatedProperties += 1
            translations.push(translationForPropertyAndLocale)
        } else {
            translations.push({
                property: property.translationKey,
                locale: localeId,
                value: '',
            })
        }
    }

    let translationState = PAGE_CONFIGS.PARTIAL_TRANSLATED_ID
    if (translatedProperties === 0) {
        translationState = PAGE_CONFIGS.UNTRANSLATED_ID
    } else if (translatedProperties === translatableProperties.length) {
        translationState = PAGE_CONFIGS.TRANSLATED_ID
    }

    return {
        ...element,
        translations,
        translationState,
    }
}

class TranslationsPage extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
    }

    /* configuring initial state */
    constructor(props) {
        super(props)

        /* filtering for translatable models and transforming model for select */
        const schemaEntries = this.updatableAndTranslatableModelsAsSchemaEntries()

        this.state = {
            showConfirmation: false,
            showSnackbar: false,
            snackbarConf: DEFAULT_SNACKBAR_CONF,
            localeSelectItems: PAGE_CONFIGS.INITIAL_LOCALES,
            filterByItems: PAGE_CONFIGS.FILTER_BY_ITEMS,
            objectSelectItems: schemaEntries,
            searchFilter: {
                pager: PAGE_CONFIGS.INITIAL_PAGER,
                selectedLocale:
                    PAGE_CONFIGS.INITIAL_LOCALES.length > 0
                        ? PAGE_CONFIGS.INITIAL_LOCALES[0]
                        : null,
                selectedObject:
                    schemaEntries.length > 0 ? schemaEntries[0] : null,
                selectedFilter: PAGE_CONFIGS.ALL_ITEM,
                searchTerm: '',
            },
            /* all instances of selected object type, fetched from server */
            objectInstances: [],
            /* objects filtered for current filter */
            searchResults: [],
            /* object filtered for current page */
            currentPageResults: [],
            /* changes array - id, locale, state before save*/
            unsavedChangesMap: [],
            nextSelectedObject: null,
        }
    }

    /* componet lifestyle methods */
    componentDidMount() {
        this.startLoading()

        /* Fetch languages and objects for Filter component */
        this.promiseToFetchLanguages()
            .then(response => {
                const localeSelectItems = this.buildLanguageSelectItemsArrayFromApiResponse(
                    response
                )

                this.setState({
                    localeSelectItems,
                })

                this.applyNextSearchFilter(
                    this.nextSearchFilterWithChange({
                        selectedLocale: this.userLocaleFrom(localeSelectItems),
                    })
                )

                /* FIXME risk to problems because setState is async -- use function setState */
                this.fetchElementsForObjectAndUpdateResults(
                    this.state.searchFilter.selectedObject
                )

                this.clearFeedbackSnackbar()
            })
            .catch(error => {
                this.manageError(error)
            })
    }

    /* event handlers */
    onLocaleChange = selectedLocale => {
        this.applyNextSearchFilter(
            this.nextSearchFilterWithChange({
                selectedLocale,
                pager: PAGE_CONFIGS.INITIAL_PAGER,
            })
        )
    }

    onFilterChange = selectedFilter => {
        this.applyNextSearchFilter(
            this.nextSearchFilterWithChange({
                selectedFilter,
                pager: PAGE_CONFIGS.INITIAL_PAGER,
            })
        )
    }

    onObjectChange = object => {
        if (this.state.unsavedChangesMap.length) {
            this.setState({
                showConfirmation: true,
                nextSelectedObject: object,
            })
        } else {
            this.setState({ unsavedChangesMap: [] })
            this.fetchElementsForObjectAndUpdateResults(object)
        }
    }

    onSearchTermChange = searchTerm => {
        this.setState({
            searchFilter: this.nextSearchFilterWithChange({ searchTerm }),
        })
    }

    onSearchKeyPress = event => {
        if (event.key === 'Enter') {
            const searchTerm = event.target.value
            this.applyNextSearchFilter(
                this.nextSearchFilterWithChange({
                    searchTerm,
                    pager: PAGE_CONFIGS.INITIAL_PAGER,
                })
            )
        }
    }

    onChangeTranslationForObjectAndLocale = (
        objectId,
        localeId,
        translationKey,
        value
    ) => {
        // can reach here without click anywhere
        this.clearFeedbackSnackbar()

        this.updateOriginalsOnChange(objectId, localeId, translationKey, value)

        // Update current search results to keep state between pages
        const searchResults = [...this.state.searchResults]
        const searchResultsItemInstance = searchResults.find(
            objectInstance => objectInstance.id === objectId
        )
        const translationEntryForSearchResult = searchResultsItemInstance.translations.find(
            translation =>
                translation.locale === localeId &&
                translation.property === translationKey
        )
        if (translationEntryForSearchResult) {
            translationEntryForSearchResult.value = value
        } else {
            searchResultsItemInstance.translations.push({
                locale: localeId,
                property: translationKey,
                value,
            })
        }

        const currentPageResults = [...this.state.currentPageResults]
        const selectedObjectInstance = currentPageResults.find(
            objectInstance => objectInstance.id === objectId
        )
        if (selectedObjectInstance) {
            const translationEntry = selectedObjectInstance.translations.find(
                translation =>
                    translation.locale === localeId &&
                    translation.property === translationKey
            )
            if (translationEntry) {
                translationEntry.value = value
            } else {
                selectedObjectInstance.translations.push({
                    locale: localeId,
                    property: translationKey,
                    value,
                })
            }
        }

        this.setState({
            currentPageResults,
            searchResults,
        })
    }

    closeConfirmation = response => {
        if (response) {
            this.fetchElementsForObjectAndUpdateResults(
                this.state.nextSelectedObject
            )
            this.setState({
                unsavedChangesMap: [],
                nextSelectedObject: null,
            })
        }
        this.setState({ showConfirmation: false })
    }

    updateOriginalsOnChange = (objectId, localeId, translationKey, value) => {
        // Update original objects to keep state between filters
        const originals = [...this.state.objectInstances]
        const originalItemInstance = originals.find(
            objectInstance => objectInstance.id === objectId
        )

        const elementWithState = flatElementForPropertiesAndLocale(
            originalItemInstance,
            this.state.searchFilter.selectedObject.translatableProperties,
            this.state.searchFilter.selectedLocale.id
        )

        // Keep unsaved translations
        if (
            !this.state.unsavedChangesMap.some(
                unsavedChange =>
                    unsavedChange.objectId === objectId &&
                    unsavedChange.localeId === localeId
            )
        ) {
            this.state.unsavedChangesMap.push({
                objectId,
                localeId,
                originalState: elementWithState.translationState,
            })
        }

        const translationEntryForOriginal = originalItemInstance.translations.find(
            translation =>
                translation.locale === localeId &&
                translation.property === translationKey
        )
        if (translationEntryForOriginal) {
            translationEntryForOriginal.value = value
        } else {
            originalItemInstance.translations.push({
                locale: localeId,
                property: translationKey,
                value,
            })
        }
    }

    saveTranslationForObjectId = objectId => () => {
        const api = this.props.d2.Api.getApi()

        const currentLocale = this.state.searchFilter.selectedLocale.id
        const currentPageResults = [...this.state.currentPageResults]
        const selectedObjectIndex = currentPageResults.findIndex(
            objectInstance => objectInstance.id === objectId
        )
        const selectedObjectInstance = currentPageResults[selectedObjectIndex]

        const searchResults = [...this.state.searchResults]
        const selectedObjectIndexInSearchResults = searchResults.findIndex(
            objectInstance => objectInstance.id === objectId
        )

        const originalInstances = [...this.state.objectInstances]
        const selectedOriginalObjectIndex = originalInstances.findIndex(
            originalInstance => originalInstance.id === objectId
        )

        let unsaved = [...this.state.unsavedChangesMap]

        if (selectedObjectInstance) {
            this.startLoading()

            /* translations that are being shown and able to be updated, must have a value */
            const inViewEditedTranslations = selectedObjectInstance.translations.filter(
                t => t.value.trim().length
            )
            const translationsUrlForInstance = `${
                this.state.searchFilter.selectedObject.apiEndpoint
            }/${objectId}/translations/`

            const translations = [
                ...originalInstances[selectedOriginalObjectIndex].translations,
                ...inViewEditedTranslations,
            ]

            api.update(translationsUrlForInstance, {
                translations: inViewEditedTranslations,
            })
                .then(() => {
                    /* open next card and show success message */
                    /* update card state and close it */
                    const flatElement = flatElementForPropertiesAndLocale(
                        selectedObjectInstance,
                        this.state.searchFilter.selectedObject
                            .translatableProperties,
                        currentLocale
                    )

                    // Must keep all existing translations for other locales "flatElementForPropertiesAndLocale" keeps
                    // only translations for selected locale
                    flatElement.translations = [...translations]
                    flatElement.open = false

                    currentPageResults[selectedObjectIndex] = flatElement
                    searchResults[
                        selectedObjectIndexInSearchResults
                    ] = flatElement
                    originalInstances[selectedOriginalObjectIndex] = flatElement

                    // Remove item from unsavedChanges
                    unsaved = unsaved.filter(
                        element =>
                            !(
                                element.objectId === objectId &&
                                element.localeId === currentLocale
                            )
                    )

                    /* open next card */
                    if (selectedObjectIndex < currentPageResults.length - 1) {
                        currentPageResults[selectedObjectIndex + 1].open = true
                    }

                    this.setState({
                        currentPageResults,
                        searchResults,
                        objectInstances: originalInstances,
                        unsavedChangesMap: unsaved,
                    })

                    this.showSuccessMessage(
                        i18n.t(i18nKeys.messages.translationsSaved)
                    )
                })
                .catch(error => {
                    this.manageError(error)
                })
        }
    }

    goToNextPage = () => {
        const nextPager = { ...this.state.searchFilter.pager }
        nextPager.page += 1

        this.setState({
            searchFilter: this.nextSearchFilterWithChange({ pager: nextPager }),
            currentPageResults: filterElementsToPager(
                this.state.searchResults,
                nextPager
            ),
        })
    }

    goToPreviousPage = () => {
        const nextPager = { ...this.state.searchFilter.pager }
        nextPager.page -= 1

        this.setState({
            searchFilter: this.nextSearchFilterWithChange({ pager: nextPager }),
            currentPageResults: filterElementsToPager(
                this.state.searchResults,
                nextPager
            ),
        })
    }

    openCardWithObjectId = objectId => () => {
        const currentPageResults = this.state.currentPageResults.map(
            o =>
                o.id === objectId ? { ...o, open: true } : { ...o, open: false }
        )

        this.setState({
            currentPageResults,
        })
    }

    openCardOnClick = objectId => () => {
        this.clearFeedbackSnackbar()
        this.openCardWithObjectId(objectId)
    }

    hasUnsavedChanges = objectId => () => {
        const currentLocale = this.state.searchFilter.selectedLocale.id
        return this.state.unsavedChangesMap.find(
            unsavedChange =>
                unsavedChange.objectId === objectId &&
                unsavedChange.localeId === currentLocale
        )
    }

    /* Server requests */

    /* fetch instances for new selected object type */
    fetchElementsForObjectAndUpdateResults = object => {
        const model =
            object && object.id ? this.props.d2.models[object.id] : null
        if (model) {
            this.startLoading()
            model
                .list({
                    paging: false,
                    fields: 'id,displayName,name,translations',
                })
                .then(objects => {
                    const objectInstances = objects ? objects.toArray() : []

                    this.applyNextSearchFilter(
                        this.nextSearchFilterWithChange({
                            selectedObject: object,
                            pager: PAGE_CONFIGS.INITIAL_PAGER,
                        }),
                        objectInstances
                    )

                    this.clearFeedbackSnackbar()
                })
                .catch(error => {
                    this.manageError(error)
                })
        } else {
            this.manageError()
        }
    }

    promiseToFetchLanguages = () =>
        this.props.d2.Api.getApi().get(PAGE_CONFIGS.LANGUAGES_API_URL)

    /* Auxiliar functions */

    /*
        models are duplicated by singular and plural endpoint
        check the ones which are translatable and updatable
    */
    updatableAndTranslatableModelsAsSchemaEntries = () => {
        const models = this.props.d2.models || []
        const modelKeys = Object.keys(models)

        const modelNames = new Set([])
        const schemas = []

        for (let i = 0; i < modelKeys.length; i++) {
            const modelKey = modelKeys[i]
            const model = models[modelKey]
            const modelName = model.name
            if (
                !modelNames.has(modelName) &&
                model.isTranslatable() &&
                this.props.d2.currentUser.canUpdate(model)
            ) {
                modelNames.add(model.name)
                schemas.push(modelToSchemaEntry(model))
            }
        }

        schemas.sort((objectA, objectB) => {
            if (objectA.name > objectB.name) {
                return 1
            } else if (objectB.name > objectA.name) {
                return -1
            }
            return 0
        })

        return schemas
    }

    userLocaleFrom = locales => {
        const currentUser = this.props.d2.currentUser

        const userLocaleId =
            currentUser &&
            currentUser.userSettings &&
            currentUser.userSettings.keyUiLocale
                ? currentUser.userSettings.keyUiLocale
                : DEFAULT_LOCALE.id
        const userLocale = locales.find(locale => locale.id === userLocaleId)

        return userLocale || (locales.length > 0 ? locales[0] : null)
    }

    /* in memory filter */
    applyNextSearchFilter = (nextSearchFilter, objectInstances = null) => {
        const currentObjectInstances =
            objectInstances || this.state.objectInstances
        const searchFilter = { ...nextSearchFilter }
        const searchResults = this.prepareElementsToShowAndFilter(
            currentObjectInstances,
            searchFilter
        )

        /* update pagination */
        searchFilter.pager.total = searchResults.length
        searchFilter.pager.pageCount = Math.ceil(
            searchFilter.pager.total / searchFilter.pager.pageSize
        )

        this.setState({
            objectInstances: currentObjectInstances,
            searchResults,
            currentPageResults: filterElementsToPager(
                searchResults,
                searchFilter.pager
            ),
            searchFilter,
        })
    }

    /* FIXME improve the algorithm -- Lodash could be a good library to use, and divide it to models/classes */
    prepareElementsToShowAndFilter = (elements, searchFilter) => {
        if (elements && elements.length) {
            const currentLocale = searchFilter.selectedLocale.id
            const currentFilterId = searchFilter.selectedFilter.id
            const currentSearchTerm = searchFilter.searchTerm
                .trim()
                .toLowerCase()
            const newElements = []

            for (let i = 0; i < elements.length; i++) {
                const element = elements[i]
                if (
                    element.name
                        .trim()
                        .toLowerCase()
                        .includes(currentSearchTerm)
                ) {
                    const flatElement = flatElementForPropertiesAndLocale(
                        element,
                        searchFilter.selectedObject.translatableProperties,
                        currentLocale
                    )

                    const state = this.hasUnsavedChanges(element.id)()
                        ? this.hasUnsavedChanges(element.id)().originalState
                        : flatElement.translationState

                    if (
                        currentFilterId === PAGE_CONFIGS.ALL_ID ||
                        state === currentFilterId
                    ) {
                        newElements.push(flatElement)
                    }
                }
            }

            return newElements
        }

        return []
    }

    nextSearchFilterWithChange = searchFilterChange => ({
        ...this.state.searchFilter,
        ...searchFilterChange,
    })

    buildLanguageSelectItemsArrayFromApiResponse = languagesResponse => {
        const locales = languagesResponse
            ? languagesResponse.map(language => ({
                  id: language.locale,
                  name: language.name,
              }))
            : []

        return locales.length > 0 ? locales : PAGE_CONFIGS.INITIAL_LOCALES
    }

    startLoading = () => {
        this.setState({
            showSnackbar: true,
            snackbarConf: {
                type: FEEDBACK_SNACKBAR_TYPES.LOADING,
            },
        })
    }

    showSuccessMessage = message => {
        this.setState({
            showSnackbar: true,
            snackbarConf: {
                type: FEEDBACK_SNACKBAR_TYPES.SUCCESS,
                message,
            },
        })
    }

    showErrorMessage = message => {
        this.setState({
            showSnackbar: true,
            snackbarConf: {
                type: FEEDBACK_SNACKBAR_TYPES.ERROR,
                message,
            },
        })
    }

    manageError = error => {
        const messageError =
            error && error.message
                ? error.message
                : i18n.t(i18nKeys.messages.unexpectedError)

        this.showErrorMessage(messageError)
    }

    clearFeedbackSnackbar = () => {
        this.setState({
            showSnackbar: false,
            snackbarConf: DEFAULT_SNACKBAR_CONF,
        })
    }

    isLoading = () =>
        this.state.showSnackbar &&
        this.state.snackbarConf.type === FEEDBACK_SNACKBAR_TYPES.LOADING

    isSearchFilterValid = () =>
        this.state.searchFilter.selectedLocale &&
        this.state.searchFilter.selectedLocale.id &&
        this.state.searchFilter.selectedFilter &&
        this.state.searchFilter.selectedFilter.id &&
        this.state.searchFilter.selectedObject &&
        this.state.searchFilter.selectedObject.id

    render() {
        /* Feedback Snackbar */
        const feedbackElement = this.isLoading() ? (
            <div style={styles.feedbackSnackBar}>
                <CircularProgress />
            </div>
        ) : (
            <FeedbackSnackbar
                onClose={this.clearFeedbackSnackbar}
                show={this.state.showSnackbar}
                conf={this.state.snackbarConf}
            />
        )

        return (
            <Fragment>
                <TranslationsSearch
                    localeSelectLabel={i18n.t(
                        i18nKeys.searchToolbar.selects.locales.label
                    )}
                    localeSelectItems={this.state.localeSelectItems}
                    selectedLocaleId={
                        this.state.searchFilter.selectedLocale
                            ? this.state.searchFilter.selectedLocale.id
                            : null
                    }
                    onLocaleChange={this.onLocaleChange}
                    filterBySelectLabel={i18n.t(
                        i18nKeys.searchToolbar.selects.filterBy.label
                    )}
                    filterByItems={this.state.filterByItems}
                    selectedFilterId={this.state.searchFilter.selectedFilter.id}
                    onFilterChange={this.onFilterChange}
                    objectSelectLabel={i18n.t(
                        i18nKeys.searchToolbar.selects.objects.label
                    )}
                    objectSelectItems={this.state.objectSelectItems}
                    selectedObjectName={
                        this.state.searchFilter.selectedObject
                            ? this.state.searchFilter.selectedObject.id
                            : null
                    }
                    onObjectChange={this.onObjectChange}
                    searchFieldLabel={i18n.t(
                        i18nKeys.searchToolbar.searchTextField.label
                    )}
                    searchTerm={this.state.searchFilter.searchTerm}
                    onSearchTermChange={this.onSearchTermChange}
                    onSearchKeyPress={this.onSearchKeyPress}
                />
                <TranslationsList
                    localeId={this.state.searchFilter.selectedLocale.id}
                    objects={this.state.currentPageResults}
                    translatableProperties={
                        this.state.searchFilter.selectedObject
                            .translatableProperties
                    }
                    pager={this.state.searchFilter.pager}
                    goToNextPage={this.goToNextPage}
                    goToPreviousPage={this.goToPreviousPage}
                    onChangeTranslationForObjectAndLocale={
                        this.onChangeTranslationForObjectAndLocale
                    }
                    saveTranslations={this.saveTranslationForObjectId}
                    openCard={this.openCardWithObjectId}
                    openCardOnClick={this.openCardOnClick}
                    hasUnsavedChanges={this.hasUnsavedChanges}
                    clearFeedback={this.clearFeedbackSnackbar}
                />
                <div id="feedback-snackbar">{feedbackElement}</div>
                <ConfirmationDialog
                    open={this.state.showConfirmation}
                    closeConfirmation={this.closeConfirmation}
                />
            </Fragment>
        )
    }
}

export default TranslationsPage
