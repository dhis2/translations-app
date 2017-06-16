import {AppAction, UpdateTranslationPayload} from "../types";
export const TRANSLATION_FORM_LOAD_OBJECTS = 'TRANSLATION_FORM_LOAD_OBJECTS';
export const TRANSLATION_FORM_LOAD_OBJECTS_SUCCESS = 'TRANSLATION_FORM_LOAD_OBJECTS_SUCCESS';
export const TRANSLATION_FORM_TRANSLATION_UPDATE = 'TRANSLATION_FORM_TRANSLATION_UPDATE';

export const loadObjectsToTranslate = (): AppAction => ({ type: TRANSLATION_FORM_LOAD_OBJECTS });
export const loadObjectsToTranslateSuccess = (payload: ListResponse): AppAction => ({ type: TRANSLATION_FORM_LOAD_OBJECTS_SUCCESS, payload });
export const updateTranslation = (payload: UpdateTranslationPayload): AppAction => ({ type: TRANSLATION_FORM_TRANSLATION_UPDATE, payload });

export const TRANSLATIONS_SAVE = 'TRANSLATIONS_SAVE';
export const TRANSLATIONS_SAVE_SUCCESS = 'TRANSLATIONS_SAVE_SUCCESS';
export const TRANSLATIONS_SAVE_ERROR = 'TRANSLATIONS_SAVE_ERROR';

export const saveTranslations = (): AppAction => ({ type: TRANSLATIONS_SAVE });
export const saveTranslationsSuccess = (): AppAction => ({ type: TRANSLATIONS_SAVE_SUCCESS });
export const saveTranslationsError = (error: Error): AppAction => ({ type: TRANSLATIONS_SAVE_ERROR, payload: error });

export const TRANSLATION_FORM_LOAD_NEXT_PAGE = 'TRANSLATION_FORM_LOAD_NEXT_PAGE';
export const TRANSLATION_FORM_LOAD_PREVIOUS_PAGE = 'TRANSLATION_FORM_LOAD_PREVIOUS_PAGE';

export const loadNextPage = () => ({ type: TRANSLATION_FORM_LOAD_NEXT_PAGE });
export const loadPreviousPage = () => ({ type: TRANSLATION_FORM_LOAD_PREVIOUS_PAGE });
