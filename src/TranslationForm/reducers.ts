import { TRANSLATION_FORM_LOAD_OBJECTS_SUCCESS, TRANSLATION_FORM_TRANSLATION_UPDATE, TRANSLATIONS_SAVE_SUCCESS } from './actions';
import { Map } from 'immutable';
import {AppAction} from "../types";

type PropertyValues = {
    [index:string]: string;
}

function createTranslationObjectForModel(model: Model) {
    const { id, displayName, translations } =  model;
    const translatableProperties = model.modelDefinition.getTranslatableProperties();

    const propertyValues = translatableProperties.reduce((acc: PropertyValues, property: string) => {
        acc[property] = model[property];
        return acc;
    }, {});

    return Map({
        id,
        displayName,
        translations: translations
            .reduce((acc: Map<string, Map<string, string>>, translation: Translation) => {
                return acc.setIn([translation.locale, translation.property], translation.value);
            }, Map()),
        // Add all the base values to the object
        ...propertyValues,
        isChanged: false,
    });
}

function modelCollectionToImmutable(modelCollection: ModelCollection) {
    return Map(
        modelCollection
            .toArray()
            .map((model: Model) => ([
                model.id,
                createTranslationObjectForModel(model)
            ]))
    );
}

export function translationFormReducer(state = { objectTranslationKeys: Map(), items: Map() }, action: AppAction) {
    switch (action.type) {
        case TRANSLATION_FORM_LOAD_OBJECTS_SUCCESS:
            return {
                ...state,
                pager: action.payload.pager,
                items: modelCollectionToImmutable(action.payload),
                objectTranslationKeys: state.objectTranslationKeys.set(action.payload.modelDefinition.plural, action.payload.modelDefinition.getTranslatablePropertiesWithKeys())
            };

        case TRANSLATION_FORM_TRANSLATION_UPDATE:
            const  { objectId, locale, translationKey, value } = action.payload;
            let newItems;

            if (value) {
                newItems = state.items
                    .setIn([objectId, 'translations', locale, translationKey], value)
                    .setIn([objectId, 'isChanged'], true);
            } else {
                newItems = state.items
                    .deleteIn([objectId, 'translations', locale, translationKey])
                    .setIn([objectId, 'isChanged'], true);
            }

            return {
                ...state,
                items: newItems,
            };

        case TRANSLATIONS_SAVE_SUCCESS:
            return {
                ...state,
                items: state.items
                    .map((item: Map<string, any>) => item.set('isChanged', false))
            };
    }

    return state;
}
