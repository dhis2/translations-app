import {ActionsObservable, combineEpics} from 'redux-observable';
import { APP_START, KEYBOARD_SHORTCUTS_SAVE_TRANSLATIONS } from './actions';
import {loadObjectsToTranslate, saveTranslations} from './TranslationForm/actions';
import translationFormEpics from './TranslationForm/epics';
import toolBarEpics from './ToolBar/epics';
import { initToolBarRequest } from './ToolBar/actions';
import { TOOLBAR_UPDATED, TOOLBAR_SAVE } from './ToolBar/actions';
import { toolbarStateSelector } from './ToolBar/selectors';
import { hasUnsavedObjects } from './TranslationForm/selectors';
import {AppAction, StoreState, ToolBarState} from "./types";
import {MiddlewareAPI} from "redux";
import {Observable} from "rxjs/Observable";

const appStartEpic = (action$: ActionsObservable<AppAction>) => action$
    .ofType(APP_START)
    .mapTo(initToolBarRequest());

const appToolBarUpdated = (action$: ActionsObservable<AppAction>, store: MiddlewareAPI<StoreState>) => action$
    .ofType(TOOLBAR_UPDATED)
    .map((): StoreState => store.getState())
    .map(toolbarStateSelector)
    .distinctUntilKeyChanged('selectedObjectType')
    .map(loadObjectsToTranslate);

const saveFromShortCut = (action$: ActionsObservable<AppAction>) => Observable
    .merge(
        action$
            .ofType(KEYBOARD_SHORTCUTS_SAVE_TRANSLATIONS),
        action$
            .ofType(TOOLBAR_SAVE)
    )
    .mapTo(saveTranslations());

const shortCutEpics = combineEpics(saveFromShortCut);

export default combineEpics(appStartEpic, appToolBarUpdated, translationFormEpics, toolBarEpics, shortCutEpics);
