/* global DHIS_CONFIG */
/* React */
import React from 'react'
import ReactDOM from 'react-dom'

/*
   FIXME
   Needs to be used to solve duplicated styles on production
   This seems to happen due to different material-ui versions
   See:
    https://github.com/mui-org/material-ui/issues/8223
   solution:
    https://material-ui.com/customization/css-in-js/#creategenerateclassname-options-class-name-generator
*/
import JssProvider from 'react-jss/lib/JssProvider'

/* d2 */
import { init, getManifest, getUserSettings } from 'd2/lib/d2'

/* i18n */
import { configI18n, injectTranslationsToD2 } from './configI18n'

import App from './App'

import './index.css'

import { unregister } from './registerServiceWorker'

/* init d2 */
let d2Instance

getManifest('manifest.webapp').then(manifest => {
    let baseUrl
    if (process.env.NODE_ENV === 'production') {
        baseUrl = `${manifest.getBaseUrl()}/api/${manifest.dhis2.apiVersion}`
    } else {
        baseUrl = DHIS_CONFIG.baseUrl
            ? `${DHIS_CONFIG.baseUrl}/api/${manifest.dhis2.apiVersion}`
            : `http://localhost:8080/api/${manifest.dhis2.apiVersion}`
    }

    // init d2 with configs
    init({
        baseUrl,
    })
        .then(d2 => {
            d2Instance = d2
        })
        .then(getUserSettings)
        .then(configI18n)
        .then(() => {
            injectTranslationsToD2(d2Instance)
            ReactDOM.render(
                <JssProvider>
                    <App d2={d2Instance} />
                </JssProvider>,
                document.getElementById('app')
            )
        })
})

unregister()
