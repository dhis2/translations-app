import { compose, nthArg } from 'lodash/fp';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { translate } from 'react-i18next';
import { mapProps } from 'recompose';
import { localesSelector, selectedLocaleSelector } from './selectors';
import { changeLocale } from './actions';
import {Locale, SelectFieldChangeHandler, StoreState} from "../types";

type LocaleSelectorProps = {
    locales: Array<Locale>;
    currentLocale: string;
    onLocaleChange: SelectFieldChangeHandler;
    selectLabel: string;
}

function LocaleSelector({ locales = [], currentLocale, onLocaleChange, selectLabel }: LocaleSelectorProps) {
    const localeItems = locales.map(locale => (
        <MenuItem
            key={locale.locale}
            value={locale.locale}
            primaryText={locale.name}
        />
    ));

    return (
        <SelectField
            className="tool-bar--select-field"
            value={currentLocale}
            onChange={compose(onLocaleChange, nthArg(2))}
            floatingLabelText={selectLabel}
        >
            {localeItems}
        </SelectField>
    );
}

const mapStateToProps = (state: StoreState) => ({
    locales: localesSelector(state),
    currentLocale: selectedLocaleSelector(state),
});

const mapDispatchToProps = bindActionCreators.bind(null, {
    onLocaleChange: changeLocale,
});

const enhance = compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate(),
    mapProps(({ t, ...props }) => ({
        ...props,
        selectLabel: t('Target Locale'),
    }))
);

export default enhance(LocaleSelector);
