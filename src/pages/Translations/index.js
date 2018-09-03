/* React */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/* d2-ui */
import { FeedbackSnackbar, CircularProgress } from '@dhis2/d2-ui-core';

/* components */
import TranslationsSearch from './TranslationsSearch';
import TranslationsList from './TranslationsList';

/* i18n */
import { i18nKeys } from '../../i18n';
import i18n from '../../locales';

/* utils */
import * as PAGE_CONFIGS from './translations.conf';
import * as FEEDBACK_SNACKBAR_TYPES from '../../utils/feedbackSnackBarTypes';
import { DEFAULT_LOCALE } from '../../configI18n';

/* styles */
import styles from '../../styles';

/* constants */
const DEFAULT_SNACKBAR_CONF = {
    type: FEEDBACK_SNACKBAR_TYPES.NONE,
    message: '',
    action: '',
    onActionClick: null,
};

/* auxiliar methods */
/* FIXME move to an external file? */
const modelToSchemaEntry = model => ({
    id: model.name,
    name: model.displayName,
    translatableProperties: model.getTranslatablePropertiesWithKeys(),
    apiEndpoint: model.apiEndpoint,
});

class TranslationsPage extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        /* filtering for translatable models and transforming model for select */
        const schemaEntries = this.updatableAndTranslatableModelsAsSchemaEntries();

        this.state = {
            showSnackbar: false,
            snackbarConf: DEFAULT_SNACKBAR_CONF,
            localeSelectItems: PAGE_CONFIGS.INITIAL_LOCALES,
            objectSelectItems: schemaEntries,
            searchFilter: {
                pager: PAGE_CONFIGS.INITIAL_PAGER,
                selectedLocale: PAGE_CONFIGS.INITIAL_LOCALES.length > 0 ? PAGE_CONFIGS.INITIAL_LOCALES[0] : null,
                selectedObject: schemaEntries.length > 0 ? schemaEntries[0] : null,
                searchTerm: '',
                hideTranslated: false,
            },
            searchResults: null,
        };
    }

    componentDidMount() {
        this.startLoading();

        /* Fetch languages and objects for Filter component */
        this.promiseToFetchLanguages().then((response) => {
            const localeSelectItems = this.buildLanguageSelectItemsArrayFromApiResponse(response);

            this.setState({
                localeSelectItems,
            });

            this.applyNextSearchFilter(this.nextSearchFilterWithChange({
                selectedLocale: this.userLocalesIn(localeSelectItems),
            }));

            this.clearFeedbackSnackbar();
        }).catch((error) => {
            this.manageError(error);
        });
    }

    onLocaleChange = (selectedLocale) => {
        this.setState({
            searchFilter: this.nextSearchFilterWithChange({ selectedLocale }),
        });
    };

    onObjectChange = (object) => {
        this.applyNextSearchFilter(this.nextSearchFilterWithChange({ selectedObject: object }));
    };

    onSearchTermChange = (searchTerm) => {
        this.setState({
            searchFilter: this.nextSearchFilterWithChange({ searchTerm }),
        });
    };

    onSearchKeyPress = (event) => {
        if (event.key === 'Enter') {
            const searchTerm = event.target.value;
            this.applyNextSearchFilter(this.nextSearchFilterWithChange({ searchTerm }));
        }
    };

    onChangeTranslationForObjectAndLocale = (objectId, localeId, translationKey, value) => {
        const searchResults = [...this.state.searchResults];
        const selectedObjectInstance = searchResults.find(objectInstance => objectInstance.id === objectId);
        if (selectedObjectInstance) {
            const translationEntry = selectedObjectInstance.translations.find(
                translation => translation.locale === localeId && translation.property === translationKey);
            if (translationEntry) {
                translationEntry.value = value;
            } else {
                selectedObjectInstance.translations.push({
                    locale: localeId,
                    property: translationKey,
                    value,
                });
            }
            this.setState({
                searchResults,
            });
        }
    };

    toggleHideTranslated = () => {
        this.setState({
            searchFilter: {
                ...this.state.searchFilter,
                hideTranslated: !this.state.searchFilter.hideTranslated,
            },
        });
    };

    /*
        models are duplicated by singular and plural endpoint
        check the ones which are translatable and updatable
    */
    updatableAndTranslatableModelsAsSchemaEntries = () => {
        const models = this.props.d2.models || [];
        const modelKeys = Object.keys(models);

        const modelNames = new Set([]);
        const schemas = [];

        for (let i = 0; i < modelKeys.length; i++) {
            const modelKey = modelKeys[i];
            const model = models[modelKey];
            const modelName = model.name;
            if (!modelNames.has(modelName) && model.isTranslatable() && this.props.d2.currentUser.canUpdate(model)) {
                modelNames.add(model.name);
                schemas.push(modelToSchemaEntry(model));
            }
        }

        return schemas;
    };

    userLocalesIn = (locales) => {
        const currentUser = this.props.d2.currentUser;

        const userLocaleId = currentUser && currentUser.userSettings && currentUser.userSettings.keyUiLocale
            ? currentUser.userSettings.keyUiLocale
            : DEFAULT_LOCALE.id;
        const userLocale = locales.find(locale => locale.id === userLocaleId);

        return userLocale || (locales.length > 0 ? locales[0] : null);
    };

    saveTranslationForObjectId = objectId => () => {
        const api = this.props.d2.Api.getApi();

        const searchResults = [...this.state.searchResults];
        const selectedObjectIndex = searchResults.findIndex(objectInstance => objectInstance.id === objectId);
        const selectedObjectInstance = searchResults[selectedObjectIndex];

        if (selectedObjectInstance) {
            this.startLoading();

            /* translations that are being shown and able to be updated */
            const inViewTranslations = selectedObjectInstance.translations;
            const translationsUrlForInstance =
                `${this.state.searchFilter.selectedObject.apiEndpoint}/${objectId}/translations/`;

            /* request old translations to avoid overwrite other locales updated meanwhile */
            api.get(translationsUrlForInstance).then((response) => {
                /* other translations which are not for the locale we are updating */
                const notUpdateTranslations = response.translations
                    .filter(translation => translation.locale !== this.state.searchFilter.selectedLocale.id);
                const translations = [...notUpdateTranslations, ...inViewTranslations];

                api.update(translationsUrlForInstance, { translations }).then(() => {
                    /* open next card and show success message */
                    if (selectedObjectIndex < searchResults.length - 1) {
                        selectedObjectInstance.open = false;
                        selectedObjectInstance.translated = true;
                        searchResults[selectedObjectIndex + 1].open = true;

                        this.setState({
                            searchResults,
                        });
                    }

                    this.showSuccessMessage(i18n.t(i18nKeys.messages.translationsSaved));
                }).catch((error) => {
                    this.manageError(error);
                });
            }).catch((error) => {
                this.manageError(error);
            });
        }
    };

    openCardWithObjectId = objectId => () => {
        const searchResults = this.state.searchResults
            .map(o => (o.id === objectId ? { ...o, open: true } : { ...o, open: false }));

        this.setState({
            searchResults,
        });
    };

    clearFeedbackSnackbar = () => {
        this.setState({
            showSnackbar: false,
            snackbarConf: DEFAULT_SNACKBAR_CONF,
        });
    };

    goToNextPage = () => {
        const nextPager = { ...this.state.searchFilter.pager };
        nextPager.page += 1;

        this.applyNextSearchFilter(this.nextSearchFilterWithChange({ pager: nextPager }));
    };

    goToPreviousPage = () => {
        const nextPager = { ...this.state.searchFilter.pager };
        nextPager.page -= 1;

        this.applyNextSearchFilter(this.nextSearchFilterWithChange({ pager: nextPager }));
    };

    applyNextSearchFilter = (nextSearchFilter) => {
        if (!this.isSearchFilterValid()) {
            this.showErrorMessage(i18n.t(i18nKeys.messages.invalidForm));
            return;
        }

        this.setState({
            searchFilter: nextSearchFilter,
        });

        const model = this.props.d2.models[nextSearchFilter.selectedObject.id];
        if (model) {
            this.startLoading();
            model.list({
                paging: true,
                page: nextSearchFilter.pager.page,
                pageSize: nextSearchFilter.pager.pageSize,
                fields: 'id,displayName,name,translations',
                filter: this.filtersForSearch(nextSearchFilter),
            }).then((response) => {
                /* classify as translated or not */
                const searchResults = response ? response.toArray() : [];
                for (let i = 0; i < searchResults.length; i++) {
                    const object = searchResults[i];

                    /* FIXME move it to a function */
                    object.translated = object.translations
                        .filter(t => t.locale === nextSearchFilter.selectedLocale.id)
                        .some(t => t.value && t.value.length > 0);
                }

                /* first card is open */
                if (searchResults.length > 0) {
                    searchResults[0].open = true;
                }

                this.setState({
                    searchResults,
                    searchFilter: {
                        ...nextSearchFilter,
                        pager: {
                            page: response.pager.page,
                            pageCount: response.pager.pageCount,
                            total: response.pager.total,
                            pageSize: response.pager.pageSize || nextSearchFilter.pager.pageSize,
                        },
                    },
                });

                this.clearFeedbackSnackbar();
            }).catch((error) => {
                this.manageError(error);
            });
        } else {
            this.manageError();
        }
    };

    filtersForSearch = ({ searchTerm }) => (searchTerm.length > 0 ? `name:ilike:${searchTerm}` : null);

    nextSearchFilterWithChange = searchFilterChange => ({
        ...this.state.searchFilter,
        ...searchFilterChange,
    });

    promiseToFetchLanguages = () => this.props.d2.Api.getApi().get(PAGE_CONFIGS.LANGUAGES_API_URL);

    buildLanguageSelectItemsArrayFromApiResponse = (languagesResponse) => {
        const locales = languagesResponse ?
            languagesResponse.map(language => ({
                id: language.locale,
                name: language.name,
            })) : [];

        return locales.length > 0 ? locales : PAGE_CONFIGS.INITIAL_LOCALES;
    };

    startLoading = () => {
        this.setState({
            showSnackbar: true,
            snackbarConf: {
                type: FEEDBACK_SNACKBAR_TYPES.LOADING,
            },
        });
    };

    showSuccessMessage = (message) => {
        this.setState({
            showSnackbar: true,
            snackbarConf: {
                type: FEEDBACK_SNACKBAR_TYPES.SUCCESS,
                message,
            },
        });
    };

    showErrorMessage = (message) => {
        this.setState({
            showSnackbar: true,
            snackbarConf: {
                type: FEEDBACK_SNACKBAR_TYPES.ERROR,
                message,
            },
        });
    };

    manageError = (error) => {
        const messageError = error && error.message ?
            error.message :
            i18n.t(i18nKeys.messages.unexpectedError);

        this.showErrorMessage(messageError);
    };

    isLoading = () => this.state.showSnackbar && this.state.snackbarConf.type === FEEDBACK_SNACKBAR_TYPES.LOADING;

    hasResultsToShow = () =>
        this.state.objectSelectItems &&
        this.state.searchFilter.selectedLocale &&
        this.state.searchFilter.selectedObject &&
        this.state.searchResults;

    isSearchFilterValid = () =>
        this.state.searchFilter.selectedLocale && this.state.searchFilter.selectedLocale.id &&
        this.state.searchFilter.selectedObject && this.state.searchFilter.selectedObject.id;

    render() {
        /* Feedback Snackbar */
        const feedbackElement = this.isLoading() ?
            (
                <div style={styles.feedbackSnackBar}>
                    <CircularProgress />
                </div>
            ) : (
                <FeedbackSnackbar
                    onClose={this.clearFeedbackSnackbar}
                    show={this.state.showSnackbar}
                    conf={this.state.snackbarConf}
                />
            );

        return (
            <div>
                <TranslationsSearch
                    localeSelectLabel={i18n.t(i18nKeys.searchToolbar.selects.locales.label)}
                    localeSelectItems={this.state.localeSelectItems}
                    selectedLocaleId={this.state.searchFilter.selectedLocale ?
                        this.state.searchFilter.selectedLocale.id : null}
                    onLocaleChange={this.onLocaleChange}
                    objectSelectLabel={i18n.t(i18nKeys.searchToolbar.selects.objects.label)}
                    objectSelectItems={this.state.objectSelectItems}
                    selectedObjectName={this.state.searchFilter.selectedObject ?
                        this.state.searchFilter.selectedObject.id : null}
                    onObjectChange={this.onObjectChange}
                    searchFieldLabel={i18n.t(i18nKeys.searchToolbar.searchTextField.label)}
                    searchTerm={this.state.searchFilter.searchTerm}
                    onSearchTermChange={this.onSearchTermChange}
                    onSearchKeyPress={this.onSearchKeyPress}
                />
                {this.hasResultsToShow() &&
                    <TranslationsList
                        localeId={this.state.searchFilter.selectedLocale.id}
                        objects={this.state.searchResults}
                        translatableProperties={this.state.searchFilter.selectedObject.translatableProperties}
                        pager={this.state.searchFilter.pager}
                        goToNextPage={this.goToNextPage}
                        goToPreviousPage={this.goToPreviousPage}
                        onChangeTranslationForObjectAndLocale={this.onChangeTranslationForObjectAndLocale}
                        saveTranslations={this.saveTranslationForObjectId}
                        openCard={this.openCardWithObjectId}
                        hideTranslated={this.state.searchFilter.hideTranslated}
                        toggleHideTranslated={this.toggleHideTranslated}
                    />
                }
                <div id="feedback-snackbar">
                    {feedbackElement}
                </div>
            </div>
        );
    }
}

export default TranslationsPage;
