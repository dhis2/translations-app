import {AppAction} from "../types";
import {SNACKBAR_CLOSE, SNACKBAR_MESSAGE} from "./actions";

type SnackBarState = {
    message?: string;
    open: boolean;
}

export function snackBarReducer(state: SnackBarState = { open: false }, action: AppAction) {
    switch (action.type) {
        case SNACKBAR_CLOSE:
            return {
                ...state,
                open: false,
            };

        case SNACKBAR_MESSAGE:
            return {
                ...state,
                open: true,
                message: action.payload,
            };
    }

    return state;
}

