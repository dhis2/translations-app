import React from 'react';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import {translate, TranslationFunction} from "react-i18next";
import { compose } from 'lodash/fp';
import {bindActionCreators, Dispatch} from "redux";
import {snackBarSelector} from "./selectors";
import {closeSnackBar} from "./actions";
import {AppAction} from "../types";

type TranslationSnackBarProps = {
    message?: string;
    open: boolean;
    handleRequestClose: (reason?: string) => void;
    t: TranslationFunction,
};

function TranslationSnackBar({ message, open, handleRequestClose, t }: TranslationSnackBarProps) {
    return (
        <Snackbar
            open={open}
            message={t(message)}
            autoHideDuration={4000}
            onRequestClose={handleRequestClose}
        />
    )
}

const mapStateToProps = snackBarSelector;
const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => bindActionCreators({
    handleRequestClose: closeSnackBar,
}, dispatch);

const enhance = compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate()
);

export default enhance(TranslationSnackBar);