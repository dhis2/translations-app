import { Pagination } from '@dhis2/d2-ui-core'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import '@dhis2/d2-ui-core/build/css/Pagination.css'
import styles from '../../styles'
import * as PAGINATION_HELPER from '../../utils/pagination'
import TranslationCard from './TranslationCard'
import { DEFAULT_TRANSLATABLE_PROPERTIES } from './translations.conf'
import translationsListStyles from './TranslationsList.style'

const PaginationBuilder = (pager, goToNextPage, goToPreviousPage) => (
    <div data-test="dhis2-translations-pagination">
        <Pagination
            total={pager.total}
            hasNextPage={PAGINATION_HELPER.hasNextPage(pager)}
            hasPreviousPage={PAGINATION_HELPER.hasPreviousPage(pager)}
            onNextPageClick={goToNextPage}
            onPreviousPageClick={goToPreviousPage}
            currentlyShown={PAGINATION_HELPER.calculatePageValue(pager)}
        />
    </div>
)

export const NoResults = () => (
    <div style={translationsListStyles.noResultsContainer}>
        <Paper style={styles.cardContainer}>No Results</Paper>
    </div>
)

const TranslationsList = props =>
    props.objects && props.objects.length > 0 ? (
        <div
            id={'translation-list-container'}
            style={translationsListStyles.container}
        >
            {PaginationBuilder(
                props.pager,
                props.goToNextPage,
                props.goToPreviousPage
            )}
            {props.objects.map(object => (
                <TranslationCard
                    key={object.id}
                    open={object.open}
                    hasUnsavedChanges={props.hasUnsavedChanges(object.id)}
                    localeId={props.localeId}
                    object={object}
                    translatableProperties={props.translatableProperties}
                    onChangeTranslationForObjectAndLocale={
                        props.onChangeTranslationForObjectAndLocale
                    }
                    saveTranslations={props.saveTranslations(object.id)}
                    openCard={props.openCard(object.id)}
                    openCardOnClick={props.openCardOnClick(object.id)}
                    clearFeedback={props.clearFeedback}
                />
            ))}
            {PaginationBuilder(
                props.pager,
                props.goToNextPage,
                props.goToPreviousPage
            )}
        </div>
    ) : (
        <NoResults />
    )

TranslationsList.propTypes = {
    clearFeedback: PropTypes.func.isRequired,
    goToNextPage: PropTypes.func.isRequired,
    goToPreviousPage: PropTypes.func.isRequired,
    hasUnsavedChanges: PropTypes.func.isRequired,
    localeId: PropTypes.string.isRequired,
    objects: PropTypes.arrayOf(
        PropTypes.shape({
            displayName: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            translationState: PropTypes.string.isRequired,
            translations: PropTypes.arrayOf(
                PropTypes.shape({
                    locale: PropTypes.string.isRequired,
                    property: PropTypes.string.isRequired,
                    value: PropTypes.string.isRequired,
                })
            ).isRequired,
        })
    ).isRequired,
    openCard: PropTypes.func.isRequired,
    openCardOnClick: PropTypes.func.isRequired,
    pager: PropTypes.shape({
        page: PropTypes.number.isRequired,
        pageCount: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
    }).isRequired,
    saveTranslations: PropTypes.func.isRequired,
    onChangeTranslationForObjectAndLocale: PropTypes.func.isRequired,
    translatableProperties: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            translationKey: PropTypes.string.isRequired,
        })
    ),
}

TranslationsList.defaultProps = {
    translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
}

export default TranslationsList
