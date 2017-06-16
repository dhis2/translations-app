import {ToolBarAction, ToolBarState} from '../types';

export const TOOLBAR_INIT__REQUEST = 'TOOLBAR_INIT__REQUEST';
export const TOOLBAR_INIT = 'TOOLBAR_INIT';
export const TOOLBAR_LOCALE_CHANGE = 'TOOLBAR_LOCALE_CHANGE';
export const TOOLBAR_OBJECT_TYPE_CHANGE = 'TOOLBAR_OBJECT_TYPE_CHANGE';
export const TOOLBAR_UPDATED = 'TOOLBAR_UPDATED';
export const TOOLBAR_SAVE = 'TOOLBAR_SAVE';

export const initToolBarRequest = (): ToolBarAction => ({ type: TOOLBAR_INIT__REQUEST });
export const initToolBar = (toolBarState: ToolBarState): ToolBarAction => ({ type: TOOLBAR_INIT, payload: toolBarState });

export const changeLocale = (locale: string): ToolBarAction => ({ type: TOOLBAR_LOCALE_CHANGE, payload: locale });

export const changeObjectType = (objectType: string): ToolBarAction => ({ type: TOOLBAR_OBJECT_TYPE_CHANGE, payload: objectType });

export const save = () => ({ type: TOOLBAR_SAVE });