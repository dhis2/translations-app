import React, { MouseEvent } from 'react';
import SaveButton from '../ToolBar/SaveButton';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import IconButton from 'material-ui/IconButton';
import {connect} from "react-redux";
import {AppAction, StoreState} from "../types";
import {Interpolate, translate} from "react-i18next";
import {bindActionCreators, Dispatch} from "redux";
import {white, orange500} from 'material-ui/styles/colors';
import {loadPreviousPage} from "../TranslationForm/actions";
import {loadNextPage} from "../TranslationForm/actions";

import './BottomBar.scss';

type BottomBarProps = {
    hasPreviousPage?: boolean;
    loadPreviousPage?: (event: MouseEvent<{}>) => void;
    hasNextPage?: boolean;
    loadNextPage?: (event: MouseEvent<{}>) => void;
    currentPage?: number;
    totalPages?: number;
};

function BottomBar(props: BottomBarProps) {
    if (!props.currentPage) {
        return null;
    }
    return (
        <div className="bottom-bar">
            <IconButton disabled={!props.hasPreviousPage} onClick={props.loadPreviousPage}>
                <ChevronLeft color={white} hoverColor={orange500} />
            </IconButton>
            <Interpolate i18nKey="Page {{current}} of {{total}}" current={`${props.currentPage}`} total={`${props.totalPages}`} />
            <SaveButton />
            <IconButton disabled={!props.hasNextPage}  onClick={props.loadNextPage}>
                <ChevronRight color={white} hoverColor={orange500} />
            </IconButton>
        </div>
    );
}

const mapStateToProps = (state: StoreState) => {
    if (state.translationForm.pager) {
        return {
            currentPage: state.translationForm.pager.page,
            totalPages: state.translationForm.pager.pageCount,
            hasNextPage: state.translationForm.pager.hasNextPage(),
            hasPreviousPage: state.translationForm.pager.hasPreviousPage(),
        };
    }
    return {};
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => bindActionCreators({
    loadNextPage,
    loadPreviousPage,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(translate()(BottomBar));