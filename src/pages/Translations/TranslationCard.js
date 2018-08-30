/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* material-ui */
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

/* d2-ui components */
import { Button } from '@dhis2/d2-ui-core';

/* i18n */
import { i18nKeys } from '../../i18n';
import i18n from '../../locales';

/* styles */
import styles from '../../styles';
import translationCardStyles from './TranslationCard.style';

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
        <Paper style={styles.cardContainer}>
            <h3 style={translationCardStyles.header}>{props.object.displayName}</h3>
            <Grid container>
                {props.translatableProperties.map(property => (
                    <Grid
                        key={property.fieldName}
                        item
                        xs={12}
                        md={props.translatableProperties.length === 1 ? 12 : 6}
                        style={styles.formControl}
                    >
                        <TextField
                            fullWidth
                            value={translationValueOfObjectForLocaleAndTranslationKey(
                                props.object,
                                props.localeId,
                                property.translationKey,
                            )}
                            type="text"
                            label={i18n.t(i18nKeys.translationForm[property.name])}
                            onChange={onChange(property.translationKey)}
                        />
                    </Grid>
                ))}
            </Grid>
            <div style={translationCardStyles.actionsContainer}>
                <Button
                    raised
                    color="primary"
                    onClick={props.saveTranslations}
                >
                    {i18n.t(i18nKeys.translationForm.actionButton.label)}
                </Button>
            </div>
        </Paper>
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
