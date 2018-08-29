/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* d2-ui */
import { Pagination } from '@dhis2/d2-ui-core';

/* d2-ui styles */
import '@dhis2/d2-ui-core/build/css/Pagination.css';

/* components */
import TranslationCard from './TranslationCard';

/* utils */
import * as PAGINATION_HELPER from '../../utils/pagination';

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

const TranslationsList = props => (
    <div>
        { PaginationBuilder(props.pager, props.goToNextPage, props.goToPreviousPage) }
        {
            props.objects.map(object => (
                <TranslationCard
                    key={object.id}
                    object={object}
                    translatableProperties={props.translatableProperties}
                />
            ),
            )
        }
        { PaginationBuilder(props.pager, props.goToNextPage, props.goToPreviousPage) }
    </div>
);

TranslationsList.propTypes = {
    objects: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
        translations: PropTypes.arrayOf(PropTypes.shape({
            property: PropTypes.string.isRequired,
            locale: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        })).isRequired,
    })).isRequired,
    translatableProperties: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        translationKey: PropTypes.string.isRequired,
    })).isRequired,
    pager: PropTypes.shape({
        pageSize: PropTypes.number.isRequired,
        page: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
        pageCount: PropTypes.number.isRequired,
    }).isRequired,
    goToNextPage: PropTypes.func.isRequired,
    goToPreviousPage: PropTypes.func.isRequired,
};

export default TranslationsList;

