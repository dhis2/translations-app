const dhisDevConfig = DHIS_CONFIG; // eslint-disable-line
if (process.env.NODE_ENV !== 'production') {
    jQuery.ajaxSetup({ headers: { Authorization: dhisDevConfig.authorization } }); // eslint-disable-line
}

import React from 'react';
import { render } from 'react-dom';
import { init, config, getManifest, getUserSettings, D2Library } from 'd2/lib/d2';
import log from 'loglevel';
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import 'react-tap-event-plugin';
import App from './app/App';
import './app/app.scss';
import d2 from 'd2/lib/d2';
import dhis2 from 'd2-ui/lib/header-bar/dhis2';
import AppTheme from './colortheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';

/*
if (process.env.NODE_ENV !== 'production') {
    jQuery.ajaxSetup({ // eslint-disable-line no-undef
        headers: {
            Authorization: `Basic ${btoa('admin:district')}`,
        },
    });
}
*/

// Render the a LoadingMask to show the user the app is in loading
// The consecutive render after we did our setup will replace this loading mask
// with the rendered version of the application.
render(
    <MuiThemeProvider muiTheme={AppTheme}>
        <LoadingMask />
    </MuiThemeProvider>
, document.getElementById('app'));

function configI18n(userSettings) {
    i18next
      .use(XHR)
      .init({
        fallbackLng: 'en',
        keySeparator: '|',
        backend: {
          loadPath: '/i18n/{{lng}}.json'
        }
    }, function(err, t) {
      const uiLocale = userSettings.keyUiLocale;
      if (uiLocale && uiLocale !== 'en') {
        i18next.changeLanguage(uiLocale);
      }      
    });
}

/**
 * Renders the application into the page.
 *
 * @param d2 Instance of the d2 library that is returned by the `init` function.
 */
function startApp(d2) {
    render(
        <MuiThemeProvider muiTheme={AppTheme}>
            <App d2={d2} />
        </MuiThemeProvider>,
        document.querySelector('#app'));
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
        // Set the baseUrl to localhost if we are in dev mode
        if (process.env.NODE_ENV !== 'production') {
            dhis2.settings.baseUrl = baseUrl;
        }    })
    .then(getUserSettings)
    .then(configI18n)
    .then(init)
    .then(startApp)
    .catch(log.error.bind(log));
