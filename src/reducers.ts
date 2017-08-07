import { combineReducers } from 'redux';
import { toolBarReducer } from './ToolBar/reducers';
import { translationFormReducer } from './TranslationForm/reducers';
import { snackBarReducer } from './SnackBar/reducers';

export default combineReducers({
    toolBar: toolBarReducer,
    translationForm: translationFormReducer,
    snackBar: snackBarReducer,
});
