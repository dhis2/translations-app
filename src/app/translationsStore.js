import { PropTypes } from 'react';
import Store from 'd2-ui/lib/store/Store';
import { isEmpty, compose, get, __, flip, negate, filter, keys, intersection, pick, curry, equals, reduce, toPairs, map, concat, identity, isArray, reverse, getOr, some, isEqual, find, uniq, noop } from 'lodash/fp';
import { getInstance } from 'd2/lib/d2';
import actions from '../actions';
import { Observable } from 'rxjs';
import getContext from 'recompose/getContext';
import mapPropsStream from 'recompose/mapPropsStream';

let store;

const availableProperties = {name:'NAME',shortName:'SHORT_NAME',description:'DESCRIPTION',formName:'FORM_NAME'};

export const filters = {
    ALL: 'ALL',
    EXISTING: 'EXISTING',
    MISSING: 'MISSING',
};

// getNamesForNonEmptyProperties :: Object -> String -> Boolean
const isPropertyEmpty = object => compose(isEmpty, get(__, object));

// getKeysWithValues :: Object -> String -> Array<String>
const getKeysWithValues = object => filter(negate(isPropertyEmpty(object)), keys(object));

// onlyAvailableProperties :: Array -> Array -> Array
const onlyAvailableProperties = intersection;

// getTranslationKeysWithValues :: Object -> Object -> Array
const getTranslationsWithValues = (availableProperties, object) => compose(pick(__, object), onlyAvailableProperties(keys(availableProperties)), getKeysWithValues)(object);

// removeTranslationsForLocale :: String -> Array<Translation> -> Array<Translation>
const removeTranslationsForLocale = curry((locale, translations) => filter(compose(negate(equals(locale)), get('locale')), translations));

// replaceKeyWithTranslationProperty :: Array<Array<String, String>
const replaceKeyWithTranslationProperty = curry((availableProperties, [key, value]) => ([availableProperties[key], value]));

const createTranslationObject = curry((locale, [property, value]) => ({ locale, property, value }));

// getTranslationObject
const getTranslationObject = (locale) => compose(createTranslationObject(locale), replaceKeyWithTranslationProperty(availableProperties));

const getTranslationsForActiveLocale = (availableProperties, locale, object) => map(getTranslationObject(locale), toPairs(getTranslationsWithValues(availableProperties, object)));

const getTranslationsToSave = availableProperties => (locale, object, translations) => concat(
    getTranslationsForActiveLocale(availableProperties, locale, object),
    removeTranslationsForLocale(locale, translations)
);

const getModelTranslationsForLocale = locale => compose(filter(compose(equals(locale), get('locale'))), get('translations'));

const transFormToTranslationObject = locale => object => {
  const translationsForLocale = getModelTranslationsForLocale(locale)(object);
  const getTranslationValue = getOr('', 'value');
  const getTranslationWithTranslationKey = curry((translationKey, translations) => find(compose(equals(translationKey), get('property')), translations));
  const getTranslationValueWithTranslationKey = compose(getTranslationValue, getTranslationWithTranslationKey);

  return reduce((acc, [modelProperty, translationKey]) => {
    acc[modelProperty] = getTranslationValueWithTranslationKey(translationKey, translationsForLocale);

    return acc;
  }, {}, toPairs(availableProperties));
};

const transFormToTranslationObjects = locale => objects => reduce((acc, object) => {
    acc[object.id] = transFormToTranslationObject(locale)(object);

    return acc;
}, {}, objects);

function loadLocales(d2) {
  const api = d2.Api.getApi();

  api.get('locales/ui',{ paging: false })
    .then(locales => {
      if (isArray(locales)) {
          setLocales(locales, getOr('en', 'currentUser.userSettings.keyUiLocale', d2));
      }
  });
}

export function loadTranslatableModelsOfType(page = 1) {
  const schemaName = store.getState().currentSchema;

  setLoading(true);

  return getInstance()
    .then(d2 => {
        return d2.models[schemaName].list({
            fields: ['id', 'displayName', 'translations'].concat(d2.models[schemaName].getTranslatableProperties()).join(','),
            page: page,
            pageSize: 5,
        })
        .then(collection => {
            setModelsToTranslate(collection.toArray());
            setLoading(false);
            store.setState({
                ...store.getState(),
                models: collection.toArray(),
                isLoading: false,
                pager: collection.pager,
            });
            return {
                pager: collection.pager,
            };
        })
    })
    // .catch(() => setCurrentSchema(oldSchema));
}

function setLocales(locales, currentLocale) {
    store.setState({
        ...store.getState(),
        locales,
        currentLocale,
    });
}

function setLoading(isLoading) {
    store.setState({
        ...store.getState(),
        isLoading,
    });
}

export function setCurrentSchema(currentSchema) {
    store.setState({
        ...store.getState(),
        currentSchema
    });

    loadTranslatableModelsOfType();
}

export function setTranslationLocale(translationLocale) {
    store.setState({
        ...store.getState(),
        currentLocale: translationLocale,
    });
}

export function setModelsToTranslate(models) {
    store.setState({
        ...store.getState(),
        models
    });
}

export function getTranslationsForLocaleFromModels(locale, models) {
    return transFormToTranslationObjects(locale)(models);
}

export function switchPage(direction){
    const { pager } = store.getState();
    let thisPage = pager.page + direction;

    if (thisPage <= 0) {
        thisPage = 1;
    } else if (thisPage > pager.pageCount) {
        thisPage = pager.pageCount;
    }

    loadTranslatableModelsOfType(thisPage);
}

export function setFilter(filterValue){
    store.setState({
        ...store.getState(),
        filter: filterValue,
    });
}

export function saveTranslationsFor(object) {
    const { models, currentLocale } = store.getState();
    const model = models.find(compose(isEqual(object.id), get('id')));
    const translations = getTranslationsToSave(availableProperties)(currentLocale, object, model.translations);
    const oldTranslations = model.translations;

    // Update the translations on the model since we assume saving will happen correctly
    model.translations = translations;
    setModelsToTranslate(models);

    // Do the actual save to the server
    return getInstance()
        .then(d2 => {
            const api = d2.Api.getApi();

            const href = `${model.modelDefinition.apiEndpoint}/${model.id}/translations`;

            return api.update(href, { translations })
                .then(() => {
                    actions.showSnackbarMessage(d2.i18n.getTranslation('saved'));
                })
                .catch(() => {
                    // When the save failed restore the original state
                    model.translations = oldTranslations;
                    setModelsToTranslate(models);

                    actions.showSnackbarMessage(d2.i18n.getTranslation('save_error'));
                });
        });
}

export function createStore() {
    store = Store.create({
      getInitialState() {
          return {
              models: [],
              locales: [],
              currentLocale: 'en',
              isLoading: true,
              currentSchema: undefined,
              pager: null,
              page: 1,
              filter: filters.ALL,
          };
      }
  });

  getInstance()
    .then(loadLocales);

  const translatableObjects$ = Observable
          .fromPromise(getInstance())
          .map(compose(uniq, map(modelDefinition => modelDefinition.plural), filter(modelDefinition => modelDefinition.isTranslatable()), getOr([], 'models')));

  return {
    state$: store
        .combineLatest(translatableObjects$, (state, translatableObjects) => ({
            ...state,
            translatableObjects,
            translations: getTranslationsForLocaleFromModels(state.currentLocale, state.models)
        })),

    setState: store.setState.bind(store),
  };
}

export function connectToStore(stateToProps = () => Observable.of({})) {
    return compose(
        getContext({ store: PropTypes.object }),
        mapPropsStream(props$ => props$
            .flatMap(({ store, ...props }) => {
                return stateToProps(store)
                    .map(storeProps => ({ ...storeProps, ...props }))
            })
        )
    );
}
