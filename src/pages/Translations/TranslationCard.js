/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* d2-ui components */
import { InputField } from '@dhis2/d2-ui-core';

const TranslationCard = props => (
    <div>
        {props.object.displayName}
        {props.translatableProperties.map(property => (
            <InputField
                key={property.fieldName}
                value=""
                type="text"
                label={property.name}
            />
        ))}
    </div>
);

TranslationCard.propTypes = {
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
};

export default TranslationCard;
