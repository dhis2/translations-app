import React, { PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { isNil, pick, compose, get } from 'lodash/fp';
import { switchPage, connectToStore } from './translationsStore';
import pure from 'recompose/pure';
import branch from 'recompose/branch';
import renderNothing from 'recompose/renderNothing';
import withHandlers from 'recompose/withHandlers';

function Pager({ pager, firstPage, lastPage, nextPage, previousPage }, { d2 }) {
    return (
        <div style={{ paddingTop: '.75rem'}}>
            <IconButton tooltip={d2.i18n.getTranslation('first_page')} tooltipPosition="top-left"
                        disabled={pager.page <= 1}
                        onClick={firstPage}>
                <FontIcon className="material-icons">fast_rewind</FontIcon>
            </IconButton>
            <IconButton tooltip={d2.i18n.getTranslation('previous_page')} tooltipPosition="top-left"
                        disabled={pager.page <= 1}
                        onClick={previousPage}>
                <FontIcon className="material-icons">navigate_before</FontIcon>
            </IconButton>
            &nbsp;
            {pager.page} / {pager.pageCount}
            &nbsp;
            <IconButton tooltip={d2.i18n.getTranslation('next_page')} tooltipPosition="top-right"
                        disabled={pager.page == pager.pageCount}
                        onClick={nextPage}>
                <FontIcon className="material-icons">navigate_next</FontIcon>
            </IconButton>
            <IconButton tooltip={d2.i18n.getTranslation('final_page')} tooltipPosition="top-right"
                        disabled={pager.page == pager.pageCount}
                        onClick={lastPage}>
                <FontIcon className="material-icons">fast_forward</FontIcon>
            </IconButton>
        </div>
    );
}

Pager.contextTypes = {
    d2: PropTypes.object,
};

Pager.propTypes = {
    pager: PropTypes.object,
};

const isPagerPropEmpty = compose(isNil, get('pager'));

const mapStoreStateToProps = store$ => store$
    .map(pick(['pager']))
    .distinctUntilKeyChanged('pager');

const enhance = compose(
    pure,
    connectToStore(mapStoreStateToProps),
    branch(isPagerPropEmpty, renderNothing),
    withHandlers({
        firstPage: () => () => {
            switchPage(-1000);
        },

        previousPage: () => () => {
            switchPage(-1);
        },

        nextPage: () => () => {
            switchPage(1);
        },

        lastPage: () => () => {
            switchPage(1000);
        },
    })
);

export default enhance(Pager);
