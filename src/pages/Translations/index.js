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
import { getUserLocaleId } from '../../configI18n';

/* utils */
import * as PAGE_CONFIGS from './translations.conf';
import * as FEEDBACK_SNACKBAR_TYPES from '../../utils/feedbackSnackBarTypes';

/* styles */
import styles from '../../styles';

/* constants */
const DEFAULT_SNACKBAR_CONF = {
    type: FEEDBACK_SNACKBAR_TYPES.NONE,
    message: '',
    action: '',
    onActionClick: null,
};

class TranslationsPage extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
    };

    state = {
        showSnackbar: false,
        snackbarConf: DEFAULT_SNACKBAR_CONF,
        localeSelectItems: PAGE_CONFIGS.INITIAL_LOCALES,
        objectSelectItems: PAGE_CONFIGS.INITIAL_OBJECTS,
        filterBySelectItems: PAGE_CONFIGS.FILTER_BY_ITEMS,
        searchFilter: {
            pager: PAGE_CONFIGS.INITIAL_PAGER,
            selectedLocale: PAGE_CONFIGS.INITIAL_LOCALES.length > 0 ? PAGE_CONFIGS.INITIAL_LOCALES[0] : null,
            selectedObject: PAGE_CONFIGS.INITIAL_OBJECTS.length > 0 ? PAGE_CONFIGS.INITIAL_OBJECTS[0] : null,
            selectedFilterBy: PAGE_CONFIGS.ALL_ITEM,
            searchTerm: '',
        },
        searchResults: null,
    };

    componentDidMount() {
        this.startLoading();

        /* Fetch languages and objects for Filter component */
        Promise.all([this.promiseToFetchLanguages(), this.promiseToFetchObjects()]).then((responses) => {
            const localeSelectItems = this.buildLanguageSelectItemsArrayFromApiResponse(responses[0]);
            const objectSelectItems = this.buildObjectSelectItemsArrayFromApiResponse(responses[1]);

            this.setState({
                objectSelectItems,
                localeSelectItems,
            });

            this.applyNextSearchFilter(this.nextSearchFilterWithChange({
                selectedLocale: this.userLocalInLocales(localeSelectItems),
                selectedObject: objectSelectItems.length > 0 ? objectSelectItems[0] : null,
            }));

            this.clearFeedbackSnackbar();
        }).catch((error) => {
            this.manageError(error);
        });
    }

    onLocaleChange = (locale) => {
        this.applyNextSearchFilter(this.nextSearchFilterWithChange({ selectedLocale: locale }));
    };

    onObjectChange = (object) => {
        this.applyNextSearchFilter(this.nextSearchFilterWithChange({ selectedObject: object }));
    };

    onFilterChange = (filterBy) => {
        this.applyNextSearchFilter(this.nextSearchFilterWithChange({ selectedFilterBy: filterBy }));
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

    userLocalInLocales = (locales) => {
        const userLocaleId = getUserLocaleId();
        const userLocale = locales.find(locale => locale.id === userLocaleId);

        return userLocale || (locales.length > 0 ? locales[0] : null);
    };

    saveTranslationForObjectId = objectId => () => {
        const api = this.props.d2.Api.getApi();

        const searchResults = [...this.state.searchResults];
        const selectedObjectInstance = searchResults.find(objectInstance => objectInstance.id === objectId);

        if (selectedObjectInstance) {
            this.startLoading();

            /* translations that are being shown and able to be updated */
            const inViewTranslations = selectedObjectInstance.translations;
            const translationsUrlForInstance =
                `${this.state.searchFilter.selectedObject.relativeApiEndpoint}/${objectId}/translations/`;

            /* request old translations to avoid overwrite other locales updated meanwhile */
            api.get(translationsUrlForInstance).then((response) => {
                /* other translations which are not for the locale we are updating */
                const notUpdateTranslations = response.translations
                    .filter(translation => translation.locale !== this.state.searchFilter.selectedLocale.id);
                const translations = [...notUpdateTranslations, ...inViewTranslations];

                api.update(translationsUrlForInstance, { translations }).then(() => {
                    this.showSuccessMessage(i18n.t(i18nKeys.messages.translationsSaved));
                }).catch((error) => {
                    this.manageError(error);
                });
            }).catch((error) => {
                this.manageError(error);
            });
        }
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
        const api = this.props.d2.Api.getApi();

        this.setState({
            searchFilter: nextSearchFilter,
        });

        this.startLoading();

        api.get(this.buildApiUrlForSearchFilter(nextSearchFilter)).then((response) => {
            this.setState({
                searchResults: response[nextSearchFilter.selectedObject.apiResponseProperty],
                searchFilter: {
                    ...nextSearchFilter,
                    pager: {
                        page: response.pager.page,
                        pageCount: response.pager.pageCount,
                        total: response.pager.total,
                        pageSize: response.pager.pageSize,
                    },
                },
            });

            this.clearFeedbackSnackbar();
        }).catch((error) => {
            this.manageError(error);
        });
    };

    buildApiUrlForSearchFilter = ({ selectedObject, searchTerm, selectedFilterBy, pager }) => {
        const urlBase = `${selectedObject.relativeApiEndpoint}?fields=id,displayName,name,translations`;

        const searchFilter = searchTerm.length > 0 ? `&filter=name:ilike:${searchTerm}` : '';

        let filterBy = '';
        if (selectedFilterBy.id === PAGE_CONFIGS.UNTRANSLATED_ID) {
            filterBy = '&filter=translations:empty';
        } else if (selectedFilterBy.id === PAGE_CONFIGS.TRANSLATED_ID) {
            filterBy = '&filter=translations:gt:0';
        }

        const pagination = `&page=${pager.page}&pageSize=${pager.pageSize}`;

        return urlBase + searchFilter + filterBy + pagination;
    };

    nextSearchFilterWithChange = searchFilterChange => ({
        ...this.state.searchFilter,
        ...searchFilterChange,
    });

    promiseToFetchLanguages = () => this.props.d2.Api.getApi().get(PAGE_CONFIGS.LANGUAGES_API_URL);

    promiseToFetchObjects = () => this.props.d2.Api.getApi().get(PAGE_CONFIGS.OBJECTS_API_URL);

    buildLanguageSelectItemsArrayFromApiResponse = (languagesResponse) => {
        const locales = languagesResponse ?
            languagesResponse.map(language => ({
                id: language.locale,
                name: language.name,
            })) : [];

        return locales.length > 0 ? locales : PAGE_CONFIGS.INITIAL_LOCALES;
    };

    buildObjectSelectItemsArrayFromApiResponse = (schemasResponse) => {
        const translatablePropertiesFromProperties = (properties) => {
            const translatableProperties = properties ? properties.filter(property => !!property.translationKey) : [];

            return translatableProperties.length > 0
                ? translatableProperties
                : PAGE_CONFIGS.DEFAULT_TRANSLATABLE_PROPERTIES;
        };

        const schemas = schemasResponse && schemasResponse.schemas ?
            schemasResponse.schemas.filter(schema =>
                schema.translatable && this.props.d2.currentUser.canUpdate(this.props.d2.models[schema.name]))
                .map(object => ({
                    id: object.name,
                    name: object.displayName,
                    relativeApiEndpoint: object.relativeApiEndpoint,
                    apiResponseProperty: object.plural,
                    translatableProperties: translatablePropertiesFromProperties(object.properties),
                })) : [];

        return schemas.length > 0 ? schemas : PAGE_CONFIGS.INITIAL_OBJECTS;
    } ;

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
        this.state.searchFilter.selectedFilterBy &&
        this.state.searchResults;

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
                    filterBySelectLabel={i18n.t(i18nKeys.searchToolbar.selects.filterBy.label)}
                    filterBySelectItems={this.state.filterBySelectItems}
                    selectedFilterId={this.state.searchFilter.selectedFilterBy.id}
                    onFilterChange={this.onFilterChange}
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
