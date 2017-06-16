/// <reference path="../typings/d2-ui/lib/loading-mask/LoadingMask.component.d.ts"/>
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { init, config, getManifest } from 'd2/lib/d2';
import log from 'loglevel';
import 'react-tap-event-plugin';
import App from './App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import store from './store';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { get } from 'lodash/fp';
import { I18nextProvider } from 'react-i18next';
import { createI18n } from './i18n';
import Process = NodeJS.Process;

const LoadingMask: any = require('d2-ui/lib/loading-mask/LoadingMask.component').default;

declare const document: Document;
declare const process: Process;
declare const DHIS_CONFIG: any;

const dhisDevConfig = DHIS_CONFIG; // eslint-disable-line

if (process.env.NODE_ENV !== 'production') {
    log.setLevel(LogLevel.DEBUG);
} else {
    log.setLevel(LogLevel.INFO);
}

// Render the a LoadingMask to show the user the app is in loading
// The consecutive render after we did our setup will replace this loading mask
// with the rendered version of the application.
render(
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <LoadingMask />
    </MuiThemeProvider>,
    document.getElementById('app')
);

/**
 * Renders the application into the page.
 */
function startApp(d2: D2) {
    const i18n = createI18n(get<string>('currentUser.userSettings.uiLocale', d2) || 'nl');

    render(
        <Provider store={store}>
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                <I18nextProvider i18n={i18n}>
                    <App d2={d2} />
                </I18nextProvider>
            </MuiThemeProvider>
        </Provider>,
        document.querySelector('#app')
    );
}


// Load the application manifest to be able to determine the location of the Api
// After we have the location of the api, we can set it onto the d2.config object
// and initialise the library. We use the initialised library to pass it into the app
// to make it known on the context of the app, so the sub-components (primarily the d2-ui components)
// can use it to access the api, translations etc.
getManifest('./manifest.webapp')
    .then(manifest => {
        const baseUrl = process.env.NODE_ENV === 'production' ? manifest.getBaseUrl() : dhisDevConfig.baseUrl;
        config.baseUrl = `${baseUrl}/api`;
        log.info(`Loading: ${manifest.name} v${manifest.version}`);
        log.info(`Built ${manifest.manifest_generated_at}`);
    })
    .then(init)
    .then(startApp)
    .catch(log.error.bind(log));
