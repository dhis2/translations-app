/* React */
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

/* material-ui */
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Done from '@material-ui/icons/Done'

/* d2-ui components */
import { Button } from '@dhis2/d2-ui-core'

/* utils */
import { TRANSLATED_ID } from './translations.conf'

/* i18n */
import { i18nKeys } from '../../i18n'
import i18n from '../../locales'

/* styles */
import styles from '../../styles'
import translationCardStyles, { colors } from './TranslationCard.style'

const translationValueOfObjectForLocaleAndTranslationKey = (
    object,
    localeId,
    translationKey
) => {
    const selectedTranslation = object.translations.find(
        translation =>
            translation.locale === localeId &&
            translation.property === translationKey
    )
    return selectedTranslation ? selectedTranslation.value : ''
}

const TranslationCard = props => {
    const { onChangeTranslationForObjectAndLocale, hasUnsavedChanges } = props
    const onChange = translationKey => event => {
        onChangeTranslationForObjectAndLocale(
            props.object.id,
            props.localeId,
            translationKey,
            event.target.value
        )
    }

    const checkSave = () => !hasUnsavedChanges()

    const getState = () =>
        hasUnsavedChanges()
            ? hasUnsavedChanges().originalState
            : props.object.translationState

    const headerStyle = () => {
        return {
            ...translationCardStyles.header,
            color: colors[getState()],
        }
    }

    const saveTranslationsOnKeyPress = event => {
        if (event.key === 'Enter' && event.ctrlKey && !checkSave()) {
            props.saveTranslations()
        }
    }

    return (
        <Paper
            tabIndex={0}
            onFocus={props.openCard}
            style={styles.cardContainer}
        >
            <Grid
                style={headerStyle()}
                onClick={props.openCardOnClick}
                container
                alignItems="center"
            >
                <Grid item xs={6}>
                    <h3>{props.object.name}</h3>
                </Grid>
                <Grid style={translationCardStyles.icon} item xs={6}>
                    {getState() === TRANSLATED_ID && (
                        <Done style={translationCardStyles.translated} />
                    )}
                </Grid>
            </Grid>
            {props.open && (
                <Fragment>
                    <Grid container>
                        {props.translatableProperties.map((property, index) => (
                            <Grid
                                key={property.name}
                                id={property.name}
                                item
                                xs={12}
                                md={
                                    props.translatableProperties.length === 1
                                        ? 12
                                        : 6
                                }
                                style={styles.formControl}
                            >
                                <TextField
                                    autoFocus={index === 0}
                                    fullWidth
                                    value={translationValueOfObjectForLocaleAndTranslationKey(
                                        props.object,
                                        props.localeId,
                                        property.translationKey
                                    )}
                                    type="text"
                                    label={i18n.t(
                                        i18nKeys.translationForm[property.name]
                                    )}
                                    onChange={onChange(property.translationKey)}
                                    onKeyDown={saveTranslationsOnKeyPress}
                                    onClick={props.clearFeedback}
                                    onBlur={props.clearFeedback}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <div style={translationCardStyles.actionsContainer}>
                        <Button
                            raised
                            color="primary"
                            onClick={props.saveTranslations}
                            disabled={checkSave()}
                        >
                            {i18n.t(
                                i18nKeys.translationForm.actionButton.label
                            )}
                        </Button>
                    </div>
                </Fragment>
            )}
        </Paper>
    )
}

TranslationCard.propTypes = {
    open: PropTypes.bool,
    hasUnsavedChanges: PropTypes.func,
    localeId: PropTypes.string.isRequired,
    object: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
        translationState: PropTypes.string.isRequired,
        translations: PropTypes.arrayOf(
            PropTypes.shape({
                property: PropTypes.string.isRequired,
                locale: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
            })
        ).isRequired,
    }).isRequired,
    translatableProperties: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            translationKey: PropTypes.string.isRequired,
        })
    ).isRequired,
    onChangeTranslationForObjectAndLocale: PropTypes.func.isRequired,
    saveTranslations: PropTypes.func.isRequired,
    openCard: PropTypes.func.isRequired,
    openCardOnClick: PropTypes.func.isRequired,
    clearFeedback: PropTypes.func.isRequired,
}

TranslationCard.defaultProps = {
    open: false,
    hasUnsavedChanges: () => false,
}

export default TranslationCard
