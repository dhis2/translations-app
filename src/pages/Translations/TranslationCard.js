import { Button } from '@dhis2/d2-ui-core'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Done from '@material-ui/icons/Done'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { i18nKeys } from '../../i18n'
import i18n from '../../locales'
import styles from '../../styles'
import translationCardStyles, { colors } from './TranslationCard.style'
import { TRANSLATED_ID } from './translations.conf'

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
        onChangeTranslationForObjectAndLocale({
            objectId: props.object.id,
            localeId: props.localeId,
            translationKey,
            value: event.target.value,
        })
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
        <div data-test="dhis2-translations-item">
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
                            {props.translatableProperties.map(
                                (property, index) => (
                                    <Grid
                                        key={property.name}
                                        id={property.name}
                                        item
                                        xs={12}
                                        md={
                                            props.translatableProperties
                                                .length === 1
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
                                                i18nKeys.translationForm[
                                                    property.name
                                                ] ?? property.name
                                            )}
                                            onChange={onChange(
                                                property.translationKey
                                            )}
                                            onKeyDown={
                                                saveTranslationsOnKeyPress
                                            }
                                            onClick={props.clearFeedback}
                                            onBlur={props.clearFeedback}
                                        />
                                    </Grid>
                                )
                            )}
                        </Grid>
                        <div
                            data-test="dhis2-translations-save-btn"
                            style={translationCardStyles.actionsContainer}
                        >
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
        </div>
    )
}

TranslationCard.propTypes = {
    clearFeedback: PropTypes.func.isRequired,
    hasUnsavedChanges: PropTypes.func.isRequired,
    localeId: PropTypes.string.isRequired,
    object: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        translationState: PropTypes.string.isRequired,
        translations: PropTypes.arrayOf(
            PropTypes.shape({
                locale: PropTypes.string.isRequired,
                property: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
            })
        ).isRequired,
    }).isRequired,
    openCard: PropTypes.func.isRequired,
    openCardOnClick: PropTypes.func.isRequired,
    saveTranslations: PropTypes.func.isRequired,
    translatableProperties: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            translationKey: PropTypes.string.isRequired,
        })
    ).isRequired,
    onChangeTranslationForObjectAndLocale: PropTypes.func.isRequired,
    open: PropTypes.bool,
}

TranslationCard.defaultProps = {
    open: false,
    hasUnsavedChanges: () => false,
}

export default TranslationCard
