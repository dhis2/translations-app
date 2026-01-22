import { useConfig } from '@dhis2/app-runtime'
import D2UIApp from '@dhis2/d2-ui-app'
import PropTypes from 'prop-types'
import React from 'react'
import TranslationsPage from '../pages/Translations/index.jsx'
import styles from '../styles.js'

const App = ({ d2 }) => {
    const { apiVersion } = useConfig()
    const featureToggles = {
        excludedObjects:
            Number.parseInt(apiVersion) >= 43 ? [] : ['dashboardItem'],
    }
    return (
        <D2UIApp>
            <div style={styles.contentArea}>
                <TranslationsPage d2={d2} featureToggles={featureToggles} />
            </div>
        </D2UIApp>
    )
}

App.propTypes = {
    d2: PropTypes.object.isRequired,
}

export default App
