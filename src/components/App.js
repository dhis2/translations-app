import D2UIApp from '@dhis2/d2-ui-app'
import PropTypes from 'prop-types'
import React from 'react'
import TranslationsPage from '../pages/Translations/index.js'
import styles from '../styles.js'

const App = ({ d2 }) => (
    <D2UIApp>
        <div style={styles.contentArea}>
            <TranslationsPage d2={d2} />
        </div>
    </D2UIApp>
)

App.propTypes = {
    d2: PropTypes.object.isRequired,
}

export default App
