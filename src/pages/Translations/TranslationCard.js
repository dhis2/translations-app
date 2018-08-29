/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* d2-ui components */
import { InputField, Button } from '@dhis2/d2-ui-core';

/* i18n */
import { i18nKeys } from '../../i18n';
import i18n from '../../locales';

const translationValueOfObjectForLocaleAndTranslationKey = (object, localeId, translationKey) => {
    const selectedTranslation = object.translations.find(
        translation => translation.locale === localeId && translation.property === translationKey);
    return selectedTranslation ? selectedTranslation.value : '';
};

const TranslationCard = (props) => {
    const { onChangeTranslationForObjectAndLocale } = props;
    const onChange = translationKey => value => onChangeTranslationForObjectAndLocale(
        props.object.id,
        props.localeId,
        translationKey,
        value,
    );

    return (
        <div>
            {props.object.displayName}
            {props.translatableProperties.map(property => (
                <InputField
                    key={property.fieldName}
                    value={translationValueOfObjectForLocaleAndTranslationKey(
                        props.object,
                        props.localeId,
                        property.translationKey,
                    )}
                    type="text"
                    label={property.name}
                    onChange={onChange(property.translationKey)}
                />
            ))}
            <Button
                raised
                color="primary"
                onClick={props.saveTranslations}
            >
                {i18n.t(i18nKeys.translationForm.actionButton.label)}
            </Button>
        </div>
    );
};

TranslationCard.propTypes = {
    localeId: PropTypes.string.isRequired,
    object: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
        translations: PropTypes.arrayOf(PropTypes.shape({
            property: PropTypes.string.isRequired,
            locale: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        })).isRequired,
    }).isRequired,
    translatableProperties: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        translationKey: PropTypes.string.isRequired,
    })).isRequired,
    onChangeTranslationForObjectAndLocale: PropTypes.func.isRequired,
    saveTranslations: PropTypes.func.isRequired,
};

export default TranslationCard;
