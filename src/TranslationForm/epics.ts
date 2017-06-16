import {ActionsObservable, combineEpics} from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mapTo';
import { getInstance } from 'd2/lib/d2';
import log from 'loglevel';
import { TRANSLATION_FORM_LOAD_OBJECTS, TRANSLATIONS_SAVE, TRANSLATIONS_SAVE_SUCCESS, TRANSLATIONS_SAVE_ERROR, TRANSLATION_FORM_LOAD_NEXT_PAGE, TRANSLATION_FORM_LOAD_PREVIOUS_PAGE, loadObjectsToTranslateSuccess, saveTranslationsSuccess, saveTranslationsError } from './actions';
import { selectedObjectTypeSelector } from '../ToolBar/selectors';
import { setMessageForSnackBar } from '../SnackBar/actions';
import { selectUnsavedObjects, hasUnsavedObjects } from './selectors';
import { models$ } from '../d2-helpers';
import {AppAction, StoreState} from "../types";
import {MiddlewareAPI} from "redux";
import {Collection} from "immutable";

export const loadNextPage = (action$: ActionsObservable<AppAction>, store: MiddlewareAPI<StoreState>) => action$
    .ofType(TRANSLATION_FORM_LOAD_NEXT_PAGE)
    .mergeMap(() => {
        return Observable.fromPromise(store.getState().translationForm.pager.getNextPage())
            .map(loadObjectsToTranslateSuccess)
            .catch(error => Observable.of({ type: 'ERROR', payload: error }));
    });

export const loadPreviousPage = (action$: ActionsObservable<AppAction>, store: MiddlewareAPI<StoreState>) => action$
    .ofType(TRANSLATION_FORM_LOAD_PREVIOUS_PAGE)
    .mergeMap(() => {
        return Observable.fromPromise(store.getState().translationForm.pager.getPreviousPage())
            .map(loadObjectsToTranslateSuccess)
            .catch(error => Observable.of({ type: 'ERROR', payload: error }));
    });

export const loadObjectsToTranslate = (action$: ActionsObservable<AppAction>, store: MiddlewareAPI<StoreState>) => action$
    .ofType(TRANSLATION_FORM_LOAD_OBJECTS)
    .mergeMap(() => {
        const state = store.getState();
        const objectType = selectedObjectTypeSelector(state);

        return models$
            .mergeMap(models => Observable
                .fromPromise(models[objectType].list({ fields: `id,displayName,${models[objectType].getTranslatableProperties().join(',')},translations` }))
                .takeUntil(action$.ofType(TRANSLATION_FORM_LOAD_OBJECTS))
            )
            .map(loadObjectsToTranslateSuccess)
            .catch(error => Observable.of({ type: 'ERROR', payload: error }));
    });

const createSaveTranslationsActionObservable = (action$: ActionsObservable<AppAction>, store: MiddlewareAPI<StoreState>) => action$
    .ofType(TRANSLATIONS_SAVE)
    .map(action => ({
        objectType: selectedObjectTypeSelector(store.getState()),
        objects: selectUnsavedObjects(store.getState()),
    }));

export const noTranslationsToSave = (action$: ActionsObservable<AppAction>, store: MiddlewareAPI<StoreState>) => createSaveTranslationsActionObservable(action$, store)
    .filter(() => !hasUnsavedObjects(store.getState()))
    .mapTo(setMessageForSnackBar('No translations to save'));

export const saveTranslations = (action$: ActionsObservable<AppAction>, store: MiddlewareAPI<StoreState>) => createSaveTranslationsActionObservable(action$, store)
    .filter(() => hasUnsavedObjects(store.getState()))
    .map(({ objectType, objects }) => {
        return objects
            .map((object: Collection<string, any>) => object.toJS())
            .map(({id, translations}) => ([
                id,
                objectType,
                Object.entries(translations)
                    .map(([locale, values]) => {
                        // {property: "NAME", locale: "mn", value: "aaaa"}
                        return Object.entries(values)
                            .map(([property, value]) => ({ property, value, locale }));
                    })
                    .reduce((a, b) => a.concat(b))
            ]));
    })
    .mergeMap((objects) => {
        return Observable.fromPromise(Promise.all(objects
            .map(([id, objectType, translations]) => {
                return getInstance()
                    .then(d2 => d2.Api.getApi())
                    .then(api => api.update(`${objectType}/${id}/translations`, { translations }));
            })
        ))
        .mapTo(saveTranslationsSuccess());
    })
    .catch(error => {
        log.error(error);
        return Observable.of(saveTranslationsError(error));
    });

export const saveTranslationsSuccessToMessage = (action$: ActionsObservable<AppAction>) => action$
    .ofType(TRANSLATIONS_SAVE_SUCCESS)
    .mapTo(setMessageForSnackBar('Translations saved'));

export const saveTranslationsErrorToMessage = (action$: ActionsObservable<AppAction>) => action$
    .ofType(TRANSLATIONS_SAVE_ERROR)
    .map(({ payload }) => setMessageForSnackBar(`Could not save translations (${payload.message})`));

export default combineEpics(loadObjectsToTranslate, saveTranslations, saveTranslationsSuccessToMessage, saveTranslationsErrorToMessage, noTranslationsToSave, loadNextPage, loadPreviousPage);
