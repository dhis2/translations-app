/* React */
import React from 'react'
import PropTypes from 'prop-types'

/* d2-ui */
import D2UIApp from '@dhis2/d2-ui-app'
import HeaderBar from '@dhis2/d2-ui-header-bar'

/* components */
import TranslationsPage from './pages/Translations'

/* styles */
import styles from './styles'

const App = props => (
    <D2UIApp>
        <HeaderBar d2={props.d2} />
        <div style={styles.contentArea}>
            <TranslationsPage d2={props.d2} />
        </div>
    </D2UIApp>
)

App.propTypes = {
    d2: PropTypes.object.isRequired,
}

export default App
