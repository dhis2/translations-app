import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'lodash/fp';
import TranslationForm from './TranslationForm';
import { itemsSelector, translatablePropertiesSelector } from './selectors';
import { selectedLocaleSelector } from '../ToolBar/selectors';
import { Map } from 'immutable';

import './Translations.scss';

function Translations({ items = Map([]), locale, translatableProperties }) {
    const translationItems = items.toArray().map(item => (
        <TranslationForm
            key={item.get('id')}
            model={item}
            locale={locale}
            translatableProperties={translatableProperties}
        />
    ));

    return (
        <div className="translations">
            {translationItems}
        </div>
    );
}

const mapStateToProps = (state) => ({
    items: itemsSelector(state),
    locale: selectedLocaleSelector(state),
    translatableProperties: translatablePropertiesSelector(state),
});

const enhance = compose(
    connect(mapStateToProps),
);

export default enhance(Translations);
