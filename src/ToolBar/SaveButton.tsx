import React, {MouseEventHandler} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Interpolate, translate, TranslationFunction} from 'react-i18next';
import { connect } from 'react-redux';
import {bindActionCreators, Dispatch} from "redux";
import { noop, compose } from 'lodash/fp';
import {AppAction} from "../types";
import {save} from "./actions";

type SaveButtonProps = {
    onClick?: MouseEventHandler<{}>,
    t?: TranslationFunction,
}
function SaveButton({ onClick = noop, t }: SaveButtonProps) {
    return (
        <div className="tool-bar--item--button">
            <RaisedButton onClick={onClick} className="tool-bar--item--button--raised-button" label={t('Save (ctrl+s)')} />
        </div>
    )
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>): SaveButtonProps => bindActionCreators({
    onClick: save,
}, dispatch);

const enhance = compose(
    connect(undefined, mapDispatchToProps),
    translate()
);

export default enhance(SaveButton);