import { Button } from '@dhis2/d2-ui-core'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Done from '@material-ui/icons/Done'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { i18nKeys } from '../../i18n.js'
import i18n from '../../locales/index.js'
import styles from '../../styles.js'
import translationCardStyles, { colors } from './TranslationCard.style.js'
import { TRANSLATED_ID } from './translations.conf.js'

const translationValueOfObjectForLocaleAndTranslationKey = (
    object,
    localeId,
    translationKey
) => {
    const selectedTranslation = object.translations.find(
        (translation) =>
            translation.locale === localeId &&
            translation.property === translationKey
    )
    return selectedTranslation ? selectedTranslation.value : ''
}

const TranslationCard = ({
    open = false, 
    hasUnsavedChanges = () => false,
    object,
    localeId,
    translatableProperties,
    onChangeTranslationForObjectAndLocale,
    saveTranslations,
    clearFeedback,
    openCard,
    openCardOnClick,
    cardTitleProperty,
}) => {
    const onChange = (translationKey) => (event) => {
        onChangeTranslationForObjectAndLocale({
            objectId: object.id,
            localeId,
            translationKey,
            value: event.target.value,
        })
    }

    const checkSave = () => !hasUnsavedChanges()

    const getState = () =>
        hasUnsavedChanges()
            ? hasUnsavedChanges().originalState
            : object.translationState

    const headerStyle = () => {
        return {
            ...translationCardStyles.header,
            color: colors[getState()],
        }
    }

    const saveTranslationsOnKeyPress = (event) => {
        if (event.key === 'Enter' && event.ctrlKey && !checkSave()) {
            saveTranslations()
        }
    }

    return (
        <div data-test="dhis2-translations-item">
            <Paper
                tabIndex={0}
                onFocus={openCard}
                style={styles.cardContainer}
            >
                <Grid
                    style={headerStyle()}
                    onClick={openCardOnClick}
                    container
                    alignItems="center"
                >
                    <Grid item xs={6}>
                        <h3>{object[cardTitleProperty]}</h3>
                    </Grid>
                    <Grid style={translationCardStyles.icon} item xs={6}>
                        {getState() === TRANSLATED_ID && (
                            <Done style={translationCardStyles.translated} />
                        )}
                    </Grid>
                </Grid>
                {open && (
                    <Fragment>
                        <Grid container>
                            {translatableProperties.map((property, index) => (
                                <Grid
                                    key={property.name}
                                    id={property.name}
                                    item
                                    xs={12}
                                    md={
                                        translatableProperties.length === 1
                                            ? 12
                                            : 6
                                    }
                                    style={styles.formControl}
                                >
                                    <TextField
                                        autoFocus={index === 0}
                                        fullWidth
                                        value={translationValueOfObjectForLocaleAndTranslationKey(
                                            object,
                                            localeId,
                                            property.translationKey
                                        )}
                                        type="text"
                                        label={i18n.t(
                                            i18nKeys.translationForm[
                                                property.name
                                            ] ?? property.name
                                        )}
                                        onChange={onChange(property.translationKey)}
                                        onKeyDown={saveTranslationsOnKeyPress}
                                        onClick={clearFeedback}
                                        onBlur={clearFeedback}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <div
                            data-test="dhis2-translations-save-btn"
                            style={translationCardStyles.actionsContainer}
                        >
                            <Button
                                raised
                                color="primary"
                                onClick={saveTranslations}
                                disabled={checkSave()}
                            >
                                {i18n.t(i18nKeys.translationForm.actionButton.label)}
                            </Button>
                        </div>
                    </Fragment>
                )}
            </Paper>
        </div>
    )
}

TranslationCard.propTypes = {
    cardTitleProperty: PropTypes.string.isRequired,
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

export default TranslationCard
