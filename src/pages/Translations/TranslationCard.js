/* React */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

/* material-ui */
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Done from '@material-ui/icons/Done';

/* d2-ui components */
import { Button } from '@dhis2/d2-ui-core';

/* utils */
import { TRANSLATED_ID } from './translations.conf';

/* i18n */
import { i18nKeys } from '../../i18n';
import i18n from '../../locales';

/* styles */
import styles from '../../styles';
import translationCardStyles, { colors } from './TranslationCard.style';

const TranslationCard = (props) => {
    const { onChangeTranslationForObjectAndLocale } = props;
    const onChange = translationKey => (event) => {
        onChangeTranslationForObjectAndLocale(
            props.object.id,
            translationKey,
            event.target.value,
        );
    };

    const headerStyle = () => ({
        ...translationCardStyles.header,
        color: colors[props.object.translationState],
    });

    const isReadyToSubmit = () => props.object.translations.some(t => t.value && t.value.trim().length);

    const saveTranslationsOnKeyPress = (event) => {
        if (event.key === 'Enter' && event.ctrlKey && isReadyToSubmit()) {
            props.saveTranslations();
        }
    };

    return (
        <Paper style={styles.cardContainer}>
            <Grid
                style={headerStyle()}
                onClick={props.openCard}
                container
                alignItems="center"
            >
                <Grid
                    item
                    xs={6}
                >
                    <h3>{props.object.name}</h3>
                </Grid>
                <Grid
                    style={translationCardStyles.icon}
                    item
                    xs={6}
                >
                    {props.object.translationState === TRANSLATED_ID &&
                        <Done
                            style={translationCardStyles.translated}
                        />
                    }
                </Grid>
            </Grid>
            { props.open &&
                <Fragment>
                    <Grid container>
                        {props.object.translations.map(t => (
                            <Grid
                                key={t.property}
                                item
                                xs={12}
                                md={props.object.translations.length === 1 ? 12 : 6}
                                style={styles.formControl}
                            >
                                <TextField
                                    fullWidth
                                    value={t.value}
                                    type="text"
                                    label={i18n.t(i18nKeys.translationForm[t.property])}
                                    onChange={onChange(t.property)}
                                    onKeyPress={saveTranslationsOnKeyPress}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <div style={translationCardStyles.actionsContainer}>
                        <Button
                            raised
                            color="primary"
                            onClick={props.saveTranslations}
                            disabled={!isReadyToSubmit()}
                        >
                            {i18n.t(i18nKeys.translationForm.actionButton.label)}
                        </Button>
                    </div>
                </Fragment>
            }
        </Paper>
    );
};

TranslationCard.propTypes = {
    open: PropTypes.bool,
    object: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
        translationState: PropTypes.string.isRequired,
        translations: PropTypes.arrayOf(PropTypes.shape({
            property: PropTypes.string.isRequired,
            locale: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        })).isRequired,
    }).isRequired,
    onChangeTranslationForObjectAndLocale: PropTypes.func.isRequired,
    saveTranslations: PropTypes.func.isRequired,
    openCard: PropTypes.func.isRequired,
};

TranslationCard.defaultProps = {
    open: false,
};

export default TranslationCard;
