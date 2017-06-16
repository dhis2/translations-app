import { Action } from 'redux';
import {TouchTapEvent} from "material-ui";
import { Map } from 'immutable';

export interface AppAction extends Action {
    type: string;
    payload?: any;
}

export interface ToolBarAction extends AppAction {
    type: string;
    payload?: any;
}

export type ToolBarState = {
    locales?: Array<string>;
    selectedLocale?: string;
    objectTypes?: Array<string>;
    selectedObjectType?: string;
    filters?: Array<string>;
    selectedFilter?: string;
}

export type PartialToolBarState = {
    locales?: Array<string>;
    selectedLocale?: string;
    objectTypes?: Array<string>;
    selectedObjectType?: string;
    filters?: Array<string>;
    selectedFilter?: string;
}

export type TranslationFormState = {
    pager: any;
    items: Map<string, any>;
}

export type ObjectTranslationKeys = Map<string, string>;
export type TranslationObject = Map<string, any>;

export type SelectFieldChangeHandler = (e: TouchTapEvent, index: number, menuItemValue: any) => void;

export type StoreState = {
    toolBar: ToolBarState;
    translationForm: TranslationFormState;
}

export type TranslatableProperty = { name: string, translationKey: string };

// D2 Types
export type Locale = { locale: string; name: string };

export type UpdateTranslationPayload = {
    objectId: string;
    locale: string;
    translationKey: string;
    value: string;
};
