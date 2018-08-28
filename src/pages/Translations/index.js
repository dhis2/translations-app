/* React */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/* d2-ui */
import { FeedbackSnackbar, CircularProgress } from '@dhis2/d2-ui-core';

/* components */
import TranslationsSearch from './TranslationsSearch';

/* i18n */
import { i18nKeys } from '../../i18n';
import i18n from '../../locales';

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
        localeSelectItems: [],
        objectSelectItems: [],
        selectedLocaleId: null,
        selectedObjectName: null,
        filterBySelectItems: PAGE_CONFIGS.FILTER_BY_ITEMS,
        selectedFilterId: PAGE_CONFIGS.ALL_ID,
        searchTerm: '',
    };

    componentDidMount() {
        this.startLoading();

        /* Fetch languages and objects for Filter component */
        Promise.all([this.promiseToFetchLanguages(), this.promiseToFetchObjects()]).then((responses) => {
            const localeSelectItems = this.buildLanguageSelectItemsArrayFromApiResponse(responses[0]);
            const objectSelectItems = this.buildObjectSelectItemsArrayFromApiResponse(responses[1]);
            this.setState({
                localeSelectItems,
                objectSelectItems,
                selectedLocaleId: localeSelectItems.length > 0 ? localeSelectItems[0].id : null,
                selectedObjectName: objectSelectItems.length > 0 ? objectSelectItems[0].id : null,
            });

            this.clearFeedbackSnackbar();
        }).catch((error) => {
            this.manageError(error);
        });
    }

    onLocaleChange = (locale) => {
        this.setState({ selectedLocaleId: locale.id });
    };

    onObjectChange = (object) => {
        this.setState({ selectedObjectName: object.id });
    };

    onFilterChange = (filterBy) => {
        this.setState({ selectedFilterId: filterBy.id });
    };

    onSearchTermChange = (searchTerm) => {
        this.setState({ searchTerm });
    };

    clearFeedbackSnackbar = () => {
        this.setState({
            showSnackbar: false,
            snackbarConf: DEFAULT_SNACKBAR_CONF,
        });
    };

    promiseToFetchLanguages = () => this.props.d2.Api.getApi().get(PAGE_CONFIGS.LANGUAGES_API_URL);

    promiseToFetchObjects = () => this.props.d2.Api.getApi().get(PAGE_CONFIGS.OBJECTS_API_URL);

    buildLanguageSelectItemsArrayFromApiResponse = languagesResponse => (languagesResponse ?
        languagesResponse.map(language => ({
            id: language.locale,
            name: language.name,
        })) : []);

    buildObjectSelectItemsArrayFromApiResponse = objectsResponse => (objectsResponse && objectsResponse.schemas ?
        objectsResponse.schemas.filter(object =>
            object.translatable &&
            this.props.d2.currentUser.canUpdate(this.props.d2.model.ModelDefinition.createFromSchema(object)))
            .map(object => ({
                id: object.name,
                name: object.displayName,
            })) : []);

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
                    selectedLocaleId={this.state.selectedLocaleId}
                    onLocaleChange={this.onLocaleChange}
                    objectSelectLabel={i18n.t(i18nKeys.searchToolbar.selects.objects.label)}
                    objectSelectItems={this.state.objectSelectItems}
                    selectedObjectName={this.state.selectedObjectName}
                    onObjectChange={this.onObjectChange}
                    filterBySelectLabel={i18n.t(i18nKeys.searchToolbar.selects.filterBy.label)}
                    filterBySelectItems={this.state.filterBySelectItems}
                    selectedFilterId={this.state.selectedFilterId}
                    onFilterChange={this.onFilterChange}
                    searchFieldLabel={i18n.t(i18nKeys.searchToolbar.searchTextField.label)}
                    searchTerm={this.state.searchTerm}
                    onSearchTermChange={this.onSearchTermChange}
                />
                <div id="feedback-snackbar">
                    {feedbackElement}
                </div>
            </div>
        );
    }
}

export default TranslationsPage;
