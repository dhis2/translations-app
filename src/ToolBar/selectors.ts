import { get, getOr } from 'lodash/fp';
import {StoreState, ToolBarState} from "../types";

type ToolBarSelector<T> = (state: StoreState) => T;

export const localesSelector: ToolBarSelector<Array<string>> = getOr([], 'toolBar.locales');
export const selectedLocaleSelector: ToolBarSelector<string> = get<string>('toolBar.selectedLocale');
export const selectedObjectTypeSelector: ToolBarSelector<string> = get<string>('toolBar.selectedObjectType');
export const objectTypesSelector: ToolBarSelector<Array<string>> = getOr([], 'toolBar.objectTypes');

export const toolbarStateSelector = (state: StoreState): ToolBarState => ({
    selectedLocale: selectedLocaleSelector(state),
    selectedObjectType: selectedObjectTypeSelector(state),
});
