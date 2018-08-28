/* React */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/* d2-ui */
import D2UIApp from '@dhis2/d2-ui-app';
import HeaderBar from '@dhis2/d2-ui-header-bar';

/* components */
import TranslationsPage from './pages/Translations';

/* styles */
import styles from './styles';

class App extends PureComponent {
  static propTypes = {
      d2: PropTypes.object.isRequired,
  };

  render() {
      return (
          <D2UIApp>
              <HeaderBar d2={this.props.d2} />
              <div style={styles.contentArea}>
                  <TranslationsPage d2={this.props.d2} />
              </div>
          </D2UIApp>
      );
  }
}

export default App;
