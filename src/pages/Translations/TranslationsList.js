/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* d2-ui */
import { Pagination, CheckBox } from '@dhis2/d2-ui-core';

/* material-ui */
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

/* d2-ui styles */
import '@dhis2/d2-ui-core/build/css/Pagination.css';

/* components */
import TranslationCard from './TranslationCard';

/* i18n */
import { i18nKeys } from '../../i18n';
import i18n from '../../locales';

/* utils */
import * as PAGINATION_HELPER from '../../utils/pagination';
import { DEFAULT_TRANSLATABLE_PROPERTIES } from './translations.conf';

/* styles */
import styles from '../../styles';
import translationsListStyles from './TranslationsList.style';

const PaginationBuilder = (pager, goToNextPage, goToPreviousPage) => (
    <Pagination
        total={pager.total}
        hasNextPage={PAGINATION_HELPER.hasNextPage(pager)}
        hasPreviousPage={PAGINATION_HELPER.hasPreviousPage(pager)}
        onNextPageClick={goToNextPage}
        onPreviousPageClick={goToPreviousPage}
        currentlyShown={PAGINATION_HELPER.calculatePageValue(pager)}
    />
);

export const NoResults = () => (
    <div style={translationsListStyles.noResultsContainer}>
        <Paper style={styles.cardContainer}>
            No Results
        </Paper>
    </div>
);

const TranslationsList = props => (props.objects && props.objects.length > 0 ?
    (
        <div style={translationsListStyles.container}>
            <Grid
                container
                alignItems="center"
            >
                <Grid
                    item
                    xs={12}
                    sm={6}
                >
                    <CheckBox
                        label={i18n.t(i18nKeys.list.hideTranslatedCheckbox.label)}
                        checked={props.hideTranslated}
                        onChange={props.toggleHideTranslated}
                    />
                </Grid>
                <Grid
                    style={translationsListStyles.pagination}
                    item
                    xs={12}
                    sm={6}
                >
                    { PaginationBuilder(props.pager, props.goToNextPage, props.goToPreviousPage) }
                </Grid>
            </Grid>

            {
                props.objects.map(object => (props.hideTranslated && object.translated ? null : (
                    <TranslationCard
                        key={object.id}
                        open={object.open}
                        localeId={props.localeId}
                        object={object}
                        translatableProperties={props.translatableProperties}
                        onChangeTranslationForObjectAndLocale={props.onChangeTranslationForObjectAndLocale}
                        saveTranslations={props.saveTranslations(object.id)}
                        openCard={props.openCard(object.id)}
                    />)),
                )
            }
            { PaginationBuilder(props.pager, props.goToNextPage, props.goToPreviousPage) }
        </div>
    ) : (
        <NoResults />
    ));

TranslationsList.propTypes = {
    hideTranslated: PropTypes.bool,
    localeId: PropTypes.string.isRequired,
    objects: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
        translated: PropTypes.bool.isRequired,
        translations: PropTypes.arrayOf(PropTypes.shape({
            property: PropTypes.string.isRequired,
            locale: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        })).isRequired,
    })).isRequired,
    translatableProperties: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        translationKey: PropTypes.string.isRequired,
    })),
    pager: PropTypes.shape({
        pageSize: PropTypes.number.isRequired,
        page: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
        pageCount: PropTypes.number.isRequired,
    }).isRequired,
    goToNextPage: PropTypes.func.isRequired,
    goToPreviousPage: PropTypes.func.isRequired,
    onChangeTranslationForObjectAndLocale: PropTypes.func.isRequired,
    saveTranslations: PropTypes.func.isRequired,
    openCard: PropTypes.func.isRequired,
    toggleHideTranslated: PropTypes.func.isRequired,
};

TranslationsList.defaultProps = {
    hideTranslated: false,
    translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
};

export default TranslationsList;

