import { uniqBy, get, uniq, sort } from 'lodash/fp';
import { combineEpics, ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import {
    initToolBar, TOOLBAR_INIT, TOOLBAR_INIT__REQUEST, TOOLBAR_LOCALE_CHANGE, TOOLBAR_OBJECT_TYPE_CHANGE,
    TOOLBAR_UPDATED
} from './actions';
import { dbLocales$, currentUserDbLocale$, models$ } from '../d2-helpers';
import {ToolBarAction, PartialToolBarState, StoreState, ToolBarState} from "../types";
import {MiddlewareAPI} from "redux";
import {toolbarStateSelector} from "./selectors";

export const toolBarInit = (action$: ActionsObservable<ToolBarAction>) => action$
    .ofType(TOOLBAR_INIT__REQUEST)
    .mergeMap((action): Observable<PartialToolBarState> => dbLocales$
        .combineLatest(
            currentUserDbLocale$,
            models$,
            (locales: string[], dbLocale: string, models: Models): PartialToolBarState => ({
                locales: uniqBy<string, string>(get<string>('locale'), locales),
                selectedLocale: dbLocale,
                objectTypes: uniq<string>(models.mapThroughDefinitions<string>((d: { name: string }) => d.name)).sort((l: string, r: string) => l.localeCompare(r)),
                selectedObjectType: 'dataElements',
            })
        )
    )
    .map(initToolBar);

function allFiltersSet(toolBarState: ToolBarState): boolean {
    console.log(toolBarState);
    return Boolean( toolBarState.selectedObjectType && toolBarState.selectedLocale);
}

export const afterInit = (action$: ActionsObservable<ToolBarAction>, store: MiddlewareAPI<StoreState>) => action$
    .ofType(TOOLBAR_INIT)
    .filter(() => allFiltersSet(toolbarStateSelector(store.getState())))
    .mapTo({ type: TOOLBAR_UPDATED });

const toolBarUpdated = (action$: ActionsObservable<ToolBarAction>, store: MiddlewareAPI<StoreState>) => Observable
    .merge(
        action$.ofType(TOOLBAR_LOCALE_CHANGE),
        action$.ofType(TOOLBAR_OBJECT_TYPE_CHANGE),
    )
    .filter(() => allFiltersSet(toolbarStateSelector(store.getState())))
    .mapTo({ type: TOOLBAR_UPDATED });

export default combineEpics(afterInit, toolBarInit, toolBarUpdated);
