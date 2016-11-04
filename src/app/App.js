import React from 'react';
import log from 'loglevel';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/lib/toolbar';

import Snackbar from 'material-ui/lib/snackbar';
import FontIcon from 'material-ui/lib/font-icon';

import AppTheme from '../colortheme';
import actions from '../actions';
import '../translationRegistration';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

let injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

import Nuqjatlh from './Main.component.js';


export default React.createClass({
    propTypes: {
        d2: React.PropTypes.object,
        tool: React.PropTypes.string,
    },

    childContextTypes: {
        d2: React.PropTypes.object,
        muiTheme: React.PropTypes.object
    },

    getChildContext() {
        return {
            d2: this.props.d2,
            muiTheme: AppTheme
        };
    },
    getInitialState: function () {
        return this.state = {
          tool:"none",
        };
    },

    componentDidMount() {
        this.subscriptions = [
            actions.showSnackbarMessage.subscribe(params => {
                if (!!this.state.snackbar) {
                    this.setState({ snackbar: undefined });
                    setTimeout(() => {
                        this.setState({ snackbar: params.data });
                    }, 150);
                } else {
                    this.setState({ snackbar: params.data });
                }
            }),
        ];
    },

    componentWillUnmount() {
        this.subscriptions.forEach(subscription => {
            subscription.dispose();
        });
    },

    closeSnackbar() {
        this.setState({ snackbar: undefined });
    },

    showSnackbar(message) {
        this.setState({ snackbar: message });
    },

    setSection(key) {
        this.setState({ section: key });
    },

    renderSection(key, apps, showUpload) {
      const d2 = this.props.d2;
      return (<Nuqjatlh d2={d2} />);
    },


    render() {
      const d2 = this.props.d2;

      return (
          <div className="app-wrapper">
              <HeaderBar/>
              <Snackbar className="snackbar"
                  message={this.state.snackbar || ''}
                  autoHideDuration={2500}
                  onRequestClose={this.closeSnackbar}
                  open={!!this.state.snackbar}
              />
              <div className="content-area">
                  {this.renderSection(this.state.section)}
              </div>
          </div>
      );
    },
});
