import { TOOLBAR_INIT, TOOLBAR_LOCALE_CHANGE, TOOLBAR_OBJECT_TYPE_CHANGE } from './actions';
import {ToolBarAction, ToolBarState} from "../types";

const initState: ToolBarState = {
    locales: [],
    selectedLocale: undefined,
    objectTypes: [],
    selectedObjectType: undefined,
};

export function toolBarReducer(state: ToolBarState = initState, action: ToolBarAction) {
    switch (action.type) {
        case TOOLBAR_INIT:
            return {
                ...state,
                ...action.payload,
            };

        case TOOLBAR_LOCALE_CHANGE:
            return {
                ...state,
                selectedLocale: action.payload,
            };

        case TOOLBAR_OBJECT_TYPE_CHANGE:
            return {
                ...state,
                selectedObjectType: action.payload,
            };
    }

    return state;
}
