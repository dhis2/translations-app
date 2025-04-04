import { FeedbackSnackbar, CircularProgress } from '@dhis2/d2-ui-core'
import PropTypes from 'prop-types'
import React, { PureComponent, Fragment } from 'react'
import { DEFAULT_LOCALE } from '../../configI18n.js'
import { i18nKeys } from '../../i18n.js'
import i18n from '../../locales/index.js'
import styles from '../../styles.js'
import * as FEEDBACK_SNACKBAR_TYPES from '../../utils/feedbackSnackBarTypes.js'
import { filterElementsToPager } from '../../utils/pagination.js'
import ConfirmationDialog from './ConfirmationDialog.jsx'
import * as PAGE_CONFIGS from './translations.conf.js'
import TranslationsList from './TranslationsList.jsx'
import TranslationsSearch from './TranslationsSearch.jsx'

const DEFAULT_SNACKBAR_CONF = {
    type: FEEDBACK_SNACKBAR_TYPES.NONE,
    message: '',
    action: '',
    onActionClick: null,
}

const OVERRIDE_TITLE_AND_SEARCH_PROPS = {
    programRuleAction: 'content',
}

/* auxiliar methods */
/* FIXME move to an external file, SchemaEntry class */
const modelToSchemaEntry = (model) => ({
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
            (t) =>
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
        const schemaEntries =
            this.updatableAndTranslatableModelsAsSchemaEntries()

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
            /* changes array - id, locale, state before save, translations before save*/
            unsavedChangesMap: [],
            nextSelectedObject: null,
        }
    }

    /* componet lifestyle methods */
    componentDidMount() {
        this.startLoading()

        /* Fetch languages and objects for Filter component */
        this.promiseToFetchLanguages()
            .then((response) => {
                const localeSelectItems =
                    this.buildLanguageSelectItemsArrayFromApiResponse(response)

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
            .catch((error) => {
                this.manageError(error)
            })
    }

    /* event handlers */
    onLocaleChange = (selectedLocale) => {
        this.applyNextSearchFilter(
            this.nextSearchFilterWithChange({
                selectedLocale,
                pager: PAGE_CONFIGS.INITIAL_PAGER,
            })
        )
    }

    onFilterChange = (selectedFilter) => {
        this.applyNextSearchFilter(
            this.nextSearchFilterWithChange({
                selectedFilter,
                pager: PAGE_CONFIGS.INITIAL_PAGER,
            })
        )
    }

    onObjectChange = (object) => {
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

    onSearchTermChange = (searchTerm) => {
        this.setState({
            searchFilter: this.nextSearchFilterWithChange({ searchTerm }),
        })
    }

    onSearchKeyPress = (event) => {
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

    onChangeTranslationForObjectAndLocale = ({
        objectId,
        localeId,
        translationKey,
        value,
    }) => {
        // can reach here without click anywhere
        this.clearFeedbackSnackbar()

        this.updateOriginalsOnChange({
            objectId,
            localeId,
            translationKey,
            value,
        })

        // Update current search results to keep state between pages
        const searchResults = [...this.state.searchResults]
        const searchResultsItemInstance = searchResults.find(
            (objectInstance) => objectInstance.id === objectId
        )
        const translationEntryForSearchResult =
            searchResultsItemInstance.translations.find(
                (translation) =>
                    translation.locale === localeId &&
                    translation.property === translationKey
            )
        if (translationEntryForSearchResult) {
            translationEntryForSearchResult.value = value
        } else {
            searchResultsItemInstance.translations.push({
                property: translationKey,
                locale: localeId,
                value,
            })
        }

        const currentPageResults = [...this.state.currentPageResults]
        const selectedObjectInstance = currentPageResults.find(
            (objectInstance) => objectInstance.id === objectId
        )
        if (selectedObjectInstance) {
            const translationEntry = selectedObjectInstance.translations.find(
                (translation) =>
                    translation.locale === localeId &&
                    translation.property === translationKey
            )
            if (translationEntry) {
                translationEntry.value = value
            } else {
                selectedObjectInstance.translations.push({
                    property: translationKey,
                    locale: localeId,
                    value,
                })
            }
        }

        this.setState({
            currentPageResults,
            searchResults,
        })
    }

    closeConfirmation = (response) => {
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

    updateOriginalsOnChange = ({
        objectId,
        localeId,
        translationKey,
        value,
    }) => {
        // Update original objects to keep state between filters
        const originals = [...this.state.objectInstances]
        const originalItemInstance = originals.find(
            (objectInstance) => objectInstance.id === objectId
        )

        const elementWithState = flatElementForPropertiesAndLocale(
            originalItemInstance,
            this.state.searchFilter.selectedObject.translatableProperties,
            this.state.searchFilter.selectedLocale.id
        )

        // Keep unsaved translations
        if (
            !this.state.unsavedChangesMap.some(
                (unsavedChange) =>
                    unsavedChange.objectId === objectId &&
                    unsavedChange.localeId === localeId
            )
        ) {
            this.state.unsavedChangesMap.push({
                objectId,
                localeId,
                originalState: elementWithState.translationState,
                originalTranslations: elementWithState.translations,
            })
        }

        const translationEntryForOriginal =
            originalItemInstance.translations.find(
                (translation) =>
                    translation.locale === localeId &&
                    translation.property === translationKey
            )
        if (translationEntryForOriginal) {
            translationEntryForOriginal.value = value
        } else {
            originalItemInstance.translations.push({
                property: translationKey,
                locale: localeId,
                value,
            })
        }
    }

    saveTranslationForObjectId = (objectId) => () => {
        const api = this.props.d2.Api.getApi()
        const currentLocale = this.state.searchFilter.selectedLocale.id

        // Current page results to update after save
        const currentPageResults = [...this.state.currentPageResults]
        const selectedObjectIndex = currentPageResults.findIndex(
            (objectInstance) => objectInstance.id === objectId
        )
        const selectedObjectInstance = currentPageResults[selectedObjectIndex]

        // Current search results to update after save
        const searchResults = [...this.state.searchResults]
        const selectedObjectIndexInSearchResults = searchResults.findIndex(
            (objectInstance) => objectInstance.id === objectId
        )

        // All translatins loaded from server to update after save
        const originalInstances = [...this.state.objectInstances]
        const selectedOriginalObjectIndex = originalInstances.findIndex(
            (originalInstance) => originalInstance.id === objectId
        )

        // Unsaved changes
        let unsaved = [...this.state.unsavedChangesMap]

        if (selectedObjectInstance) {
            this.startLoading()

            const translationsUrlForInstance = `${this.state.searchFilter.selectedObject.apiEndpoint}/${objectId}/translations/`

            // Translations that are being shown and able to be updated
            // This ones are the translations we want to update
            const inViewEditedTranslations =
                selectedObjectInstance.translations.filter(
                    (t) => t.value.trim().length && t.locale === currentLocale
                )

            // Process all translations loaded from server and also edited ones (remove empty ones)
            let allTranslationsForElement = originalInstances.find(
                (element) => element.id === objectId
            ).translations
            allTranslationsForElement = allTranslationsForElement.filter(
                (t) => t.value.trim().length
            )

            // If edited, we need to replace value with original one and send it to server
            const allUnsavedForElement = unsaved.filter(
                (element) => element.objectId === objectId
            )
            const allOriginalTranslationsForUnsaved =
                allUnsavedForElement.flatMap(
                    (element) => element.originalTranslations
                )
            let filterTranslations = allTranslationsForElement.map(
                (translation) => {
                    const existInNotSaved =
                        allOriginalTranslationsForUnsaved.find(
                            (t) =>
                                t.property === translation.property &&
                                t.locale === translation.locale
                        )
                    // Keep original value of edited translations for other locales
                    if (existInNotSaved) {
                        if (
                            existInNotSaved.value.trim().length &&
                            existInNotSaved.locale !== currentLocale
                        ) {
                            return {
                                property: translation.property,
                                locale: translation.locale,
                                value: existInNotSaved.value, //Value before edited
                            }
                        }
                        // Keep original value of not edited translations for other locales than selected one
                    } else if (translation.locale !== currentLocale) {
                        return translation
                    }
                    return null
                }
            )

            // Remove translations that have been edited, not saved and do not have original value
            filterTranslations = filterTranslations.filter(
                (element) => element != null
            )

            const translations = [
                ...filterTranslations,
                ...inViewEditedTranslations,
            ]

            api.update(translationsUrlForInstance, {
                translations: translations,
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
                    // only translations for selected locale (used to "calculate" current state/style)
                    flatElement.translations = [...allTranslationsForElement]
                    flatElement.open = false

                    currentPageResults[selectedObjectIndex] = flatElement
                    searchResults[selectedObjectIndexInSearchResults] =
                        flatElement
                    originalInstances[selectedOriginalObjectIndex] = flatElement

                    // Remove item from unsavedChanges
                    unsaved = unsaved.filter(
                        (element) =>
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
                .catch((error) => {
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

    openCardWithObjectId = (objectId) => () => {
        const currentPageResults = this.state.currentPageResults.map((o) =>
            o.id === objectId ? { ...o, open: true } : { ...o, open: false }
        )

        this.setState({
            currentPageResults,
        })
    }

    openCardOnClick = (objectId) => () => {
        this.clearFeedbackSnackbar()
        this.openCardWithObjectId(objectId)
    }

    hasUnsavedChanges =
        (objectId, locale = null) =>
        () => {
            const currentLocale = locale
                ? locale
                : this.state.searchFilter.selectedLocale.id

            return this.state.unsavedChangesMap.find(
                (unsavedChange) =>
                    unsavedChange.objectId === objectId &&
                    unsavedChange.localeId === currentLocale
            )
        }

    /* Server requests */

    /* fetch instances for new selected object type */
    fetchElementsForObjectAndUpdateResults = (object) => {
        const model =
            object && object.id ? this.props.d2.models[object.id] : null
        if (model) {
            this.startLoading()
            model
                .list({
                    paging: false,
                    fields: 'id,displayName,name,content,translations',
                })
                .then((objects) => {
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
                .catch((error) => {
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

    userLocaleFrom = (locales) => {
        const currentUser = this.props.d2.currentUser

        const userLocaleId =
            currentUser &&
            currentUser.userSettings &&
            currentUser.userSettings.keyUiLocale
                ? currentUser.userSettings.keyUiLocale
                : DEFAULT_LOCALE.id
        const userLocale = locales.find((locale) => locale.id === userLocaleId)

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
                    element[
                        OVERRIDE_TITLE_AND_SEARCH_PROPS[
                            searchFilter.selectedObject?.id
                        ] ?? 'name'
                    ]
                        ?.trim()
                        ?.toLowerCase()
                        ?.includes(currentSearchTerm)
                ) {
                    const flatElement = flatElementForPropertiesAndLocale(
                        element,
                        searchFilter.selectedObject.translatableProperties,
                        currentLocale
                    )

                    const state = this.hasUnsavedChanges(
                        element.id,
                        currentLocale
                    )()
                        ? this.hasUnsavedChanges(element.id, currentLocale)()
                              .originalState
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

    nextSearchFilterWithChange = (searchFilterChange) => ({
        ...this.state.searchFilter,
        ...searchFilterChange,
    })

    buildLanguageSelectItemsArrayFromApiResponse = (languagesResponse) => {
        const locales = languagesResponse
            ? languagesResponse.map((language) => ({
                  id: language.locale,
                  name:
                      language.name === language.displayName
                          ? language.name
                          : `${language.name} — ${language.displayName}`,
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

    showSuccessMessage = (message) => {
        this.setState({
            showSnackbar: true,
            snackbarConf: {
                type: FEEDBACK_SNACKBAR_TYPES.SUCCESS,
                message,
            },
        })
    }

    showErrorMessage = (message) => {
        this.setState({
            showSnackbar: true,
            snackbarConf: {
                type: FEEDBACK_SNACKBAR_TYPES.ERROR,
                message,
            },
        })
    }

    manageError = (error) => {
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
                    cardTitleProperty={
                        OVERRIDE_TITLE_AND_SEARCH_PROPS[
                            this.state?.searchFilter?.selectedObject?.id
                        ] ?? 'name'
                    }
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
