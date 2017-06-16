import React, {ReactElement} from 'react';
import PropTypes, {Validator} from 'prop-types';
import { withContext } from 'recompose';
import injectTapEventPlugin from 'react-tap-event-plugin';
import HeaderBar from './HeaderBar/HeaderBar';
import ToolBar from './ToolBar/ToolBar';
import TranslationForm from './TranslationForm/Translations.jsx';
import KeyboardShortCuts from './KeyboardShortCuts';
import TranslationSnackBar from './SnackBar/TranslationSnackBar';
import BottomBar from "./BottomBar/BottomBar";

import './App.scss';

injectTapEventPlugin();

function App() {
    return (
        <div id="app-wrapper" className="app-wrapper">
            <HeaderBar/>
            <ToolBar />
            <TranslationForm />
            <BottomBar />
            <TranslationSnackBar />
            <KeyboardShortCuts />
        </div>
    );
}

const withD2Context = withContext(
    { d2:  PropTypes.object },
    ({ d2 }) => ({ d2 }),
);

export default withD2Context<{ d2: D2 }, (props: {d2: D2}) => ReactElement<any>>(App);
