/* React */
import React from 'react';
import ReactDOM from 'react-dom';

/*
   FIXME
   Needs to be used to solve duplicated styles on production
   This seems to happen due to different material-ui versions
   See:
    https://github.com/mui-org/material-ui/issues/8223
   solution:
    https://material-ui.com/customization/css-in-js/#creategenerateclassname-options-class-name-generator
*/
import JssProvider from 'react-jss/lib/JssProvider';

/* d2 */
import { init, getManifest, getUserSettings } from 'd2/lib/d2';

/* i18n */
import { configI18n } from './configI18n';

import App from './App';

import './index.css';

import registerServiceWorker from './registerServiceWorker';

/* init d2 */
let d2Instance;

getManifest('manifest.webapp').then((manifest) => {
    const baseUrl =
    process.env.NODE_ENV === 'production'
        ? `${manifest.getBaseUrl()}/api/${manifest.dhis2.apiVersion}`
        : `${process.env.REACT_APP_DHIS2_BASE_URL}/api/${
            manifest.dhis2.apiVersion
        }`;

    // init d2 with configs
    init({
        baseUrl,
    })
        .then((d2) => {
            d2Instance = d2;
        })
        .then(getUserSettings)
        .then(configI18n)
        .then(() => {
            ReactDOM.render(
                <JssProvider>
                    <App d2={d2Instance} />
                </JssProvider>,
                document.getElementById('app'));
        });
});

registerServiceWorker();
