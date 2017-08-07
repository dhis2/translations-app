import {AppAction} from "../types";
export const SNACKBAR_MESSAGE = 'SNACKBAR_MESSAGE';
export const SNACKBAR_CLOSE = 'SNACKBAR_CLOSE';

export const setMessageForSnackBar = (payload: string): AppAction => ({ type: SNACKBAR_MESSAGE, payload });

export const closeSnackBar = (): AppAction  => ({ type: SNACKBAR_CLOSE });
