import {AppAction} from "./types";

export const APP_START = 'APP_START';
export const startApp = (): AppAction => ({ type: APP_START });

export const KEYBOARD_SHORTCUTS_SAVE_TRANSLATIONS = 'KEYBOARD_SHORTCUTS_SAVE_TRANSLATIONS';
export const saveTranslationsShortcut = (): AppAction => ({ type: KEYBOARD_SHORTCUTS_SAVE_TRANSLATIONS });
