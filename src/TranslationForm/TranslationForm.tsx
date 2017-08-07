import React from 'react';
import TextField from 'material-ui/TextField';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import {ActionCreator, bindActionCreators, Dispatch} from 'redux';
import { compose, nthArg, curry } from 'lodash/fp';
import { updateTranslation } from './actions';
import { Map } from 'immutable';
import './TranslationForm.scss';
import {AppAction, TranslatableProperty} from "../types";
import {TranslationFunction} from "i18next";

// TODO: Find the correct type for children
function BaseText({ children }: { children: any}) {
    return (
        <span className="translations-form__base-text">
            {children}
        </span>
    );
}

function camelCaseToHumanCase(word: string) {
    return `${word.charAt(0).toUpperCase()}${word.slice(1).replace(/([A-Z])/, (_, letter) => (` ${letter.toLowerCase()}`))}`;
}

const createTranslationHandler = curry((objectId: string, locale: string, translationKey: string, value: string) => ({ objectId, locale, translationKey, value }));

type TranslationFormProps = {
    model: Map<string, any>;
    translatableProperties: TranslatableProperty[];
    locale: string;
    onTranslationChanged: ActionCreator<AppAction>,
    t: TranslationFunction;
};
function TranslationForm({ model, translatableProperties, locale, onTranslationChanged, t }: TranslationFormProps) {
    const translations = model.getIn(['translations', locale], Map());

    if (!translatableProperties) {
        return null;
    }

    const translatableFields = translatableProperties
        .filter(({ name: propertyName }) => model.get(propertyName))
        .map(({ name: propertyName, translationKey }) => (
            <div className="translations-form__field" key={propertyName}>
                <TextField
                    floatingLabelText={t(camelCaseToHumanCase(propertyName))}
                    fullWidth
                    multiLine={propertyName === 'description'}
                    value={translations.get(translationKey, '')}
                    onChange={compose(onTranslationChanged, createTranslationHandler(model.get('id'), locale, translationKey), nthArg(1))}
                />
                <BaseText>{model.get(propertyName)}</BaseText>
            </div>
        ));

    const classes = [
        'translations-form',
        model.get('isChanged') ? 'translation-form__fields--unsaved': undefined
    ].join(' ');

    return  (
        <div className={classes}>
            <h3>{model.get('displayName')}</h3>
            <div className="translations-form__fields">
                {translatableFields}
            </div>
        </div>
    );
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => bindActionCreators({
    onTranslationChanged: updateTranslation,
}, dispatch);

const enhance = compose(
    connect(undefined, mapDispatchToProps),
    translate()
);

export default enhance(TranslationForm);
