import { getOr, get } from 'lodash/fp'
import { Map } from 'immutable';
import { selectedObjectTypeSelector } from '../ToolBar/selectors';
import {ObjectTranslationKeys, StoreState, TranslationObject} from "../types";

const isChanged = (object: TranslationObject) => object.get('isChanged');

export const itemsSelector = getOr(Map([]), 'translationForm.items');
export const objectTranslationKeysSelector = get<ObjectTranslationKeys>('translationForm.objectTranslationKeys');
export const translatablePropertiesSelector = (state: StoreState) => objectTranslationKeysSelector(state).get(selectedObjectTypeSelector(state));

export const hasUnsavedObjects = (state: StoreState) => {
    return getObjects(state).some(isChanged)
};

export const selectUnsavedObjects = (state: StoreState) => {
    return getObjects(state).filter(isChanged)
};

function getObjects(state: StoreState) {
    return itemsSelector(state).toArray();
}
