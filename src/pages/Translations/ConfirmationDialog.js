import { Button } from '@dhis2/d2-ui-core'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import React from 'react'
import { i18nKeys } from '../../i18n'
import i18n from '../../locales'
import styles from '../../styles'

const ConfirmationDialog = (props) => {
    const keepEditing = () => {
        props.closeConfirmation(false)
    }

    const discard = () => {
        props.closeConfirmation(true)
    }

    const StyledDialog = withStyles({
        root: { margin: 8 },
    })(DialogActions)

    return (
        <Dialog open={props.open}>
            <DialogTitle>{i18n.t(i18nKeys.unsavedChangesTitle)}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {i18n.t(i18nKeys.messages.unsavedChanges)}
                </DialogContentText>
            </DialogContent>
            <StyledDialog>
                <span id={'keep-editing-btn-id'}>
                    <Button style={styles.actionBtns} onClick={keepEditing}>
                        {i18n.t(i18nKeys.btns.keepEditing)}
                    </Button>
                </span>
                <span id={'discard-changes-btn-id'}>
                    <Button
                        style={styles.actionBtns}
                        raised
                        color="primary"
                        onClick={discard}
                        autoFocus
                    >
                        {i18n.t(i18nKeys.btns.discard)}
                    </Button>
                </span>
            </StyledDialog>
        </Dialog>
    )
}

ConfirmationDialog.propTypes = {
    closeConfirmation: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
}

export default ConfirmationDialog
